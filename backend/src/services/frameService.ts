import { FrameInput } from "../validator/frameValidator";
import { db } from "../config/db.js";
import { frame, study_material, massage } from "../db/schema.js";
import { eq, and, desc, sql } from "drizzle-orm";
import { uploadToImageKit } from "./uploadService.js";
import { Queue } from "bullmq";
import { generateTitleFromLink } from "../utils/urlToTitle.js"
import { deleteEmbeddingsForMaterial, searchEmbeddings } from "./embeddingService.js";
import { llmService } from "./llmService.js";
import { shouldRetrieve } from "../utils/retrivalGared.js";



export const materialQueue = new Queue("material-processing", {
  connection: { host: "127.0.0.1", port: 6379 },
});



export const frameCreationService = async (frameData: FrameInput, userId: string) => {
  try {
    const newFrame = await db.insert(frame).values({
      user_id: userId,
      title: frameData.title,
      description: frameData.description,
    }).returning({
      id: frame.id,
      title: frame.title,
      description: frame.description,
      created_at: frame.created_at,
      updated_at: frame.updated_at,
    })

    return newFrame[0];
  }
  catch (err: any) {
    throw new Error("Frame creation failed", err);
  }
}



export const frameDeletionService = async (frameId: string, userId: string) => {
  try {
    // delete massages first
    await db.delete(massage).where(eq(massage.frame_id, frameId));

    // delete study materials
    await db.delete(study_material).where(eq(study_material.frame_id, frameId));

    // finally delete frame
    const result = await db
      .delete(frame)
      .where(and(eq(frame.id, frameId), eq(frame.user_id, userId)));

    // also call pinecone cleanup if needed
    // await deleteEmbeddingsForMaterial(userId, frameId);

    if (!result || ((result as any).count !== undefined && (result as any).count === 0)) {
      throw new Error("Frame not found or unauthorized");
    }

    return 1;
  } catch (error) {
    console.error("Error deleting frame:", error);
    throw error;
  }
};


export const frameListService = async (userId: string) => {
  try {
    const frames = await db
      .select({
        id: frame.id,
        title: frame.title,
        description: frame.description,
        created_at: frame.created_at,
        updated_at: frame.updated_at,
        materialCount: sql<number>`COUNT(${study_material.id})`.as("material_count"),
        messageCount: sql<number>`COUNT(DISTINCT ${massage.id})`.as("message_count"),
      })
      .from(frame)
      .leftJoin(study_material, eq(frame.id, study_material.frame_id))
      .leftJoin(massage, eq(frame.id, massage.frame_id))
      .where(eq(frame.user_id, userId))
      .groupBy(frame.id)
      .orderBy(desc(frame.created_at));

    return frames;
  } catch (err) {
    console.error("❌ Frame listing failed:", err);
    throw new Error("Frame listing failed");
  }
};


export const singleFrameService = async (frameId: string, userId: string) => {
  try {

    const frameData = await db
      .select({
        id: frame.id,
        title: frame.title,
        description: frame.description,
        createdAt: frame.created_at,
        updatedAt: frame.updated_at,
        materialCount: sql<number>`COUNT(${study_material.id})`.as("materialCount"),
      })
      .from(frame)
      .leftJoin(study_material, eq(study_material.frame_id, frame.id))
      .where(and(eq(frame.user_id, userId), eq(frame.id, frameId)))
      .groupBy(frame.id);

    if (!frameData.length) return null;

    const materials = await db
      .select({
        id: study_material.id,
        title: study_material.title,
        type: study_material.type,
        url: study_material.url,
        processed_status: study_material.processed_status,
        createdAt: study_material.created_at,
      })
      .from(study_material)
      .where(and(eq(study_material.frame_id, frameId), eq(study_material.user_id, userId)));

    return {
      ...frameData[0],
    };
  } catch (error) {
    throw new Error("Failed to fetch frame with materials");
  }
}


export const addStudyMaterialsToFrameService = async (
  frameId: string,
  userId: string,
  buffer: Buffer,
  originalname: string,
  mimetype: string
) => {
  try {
    // Upload to ImageKit
    const uploadResult = await uploadToImageKit(buffer, originalname);

    const fileType = mimetype.startsWith("image/") ? "image" : "pdf";

    // Save initial record in DB (status = pending)
    const [newMaterial] = await db
      .insert(study_material)
      .values({
        user_id: userId,
        frame_id: frameId,
        title: originalname,
        type: fileType,
        url: uploadResult.url,
        imagekit_id: uploadResult.fileId,
        processed_status: "pending",
        ai_generated_summary: null,
        embeddings: null,
      })
      .returning();

    // Push job to Redis queue
    const job = await materialQueue.add("material-processing", {

      materialId: newMaterial?.id,
      url: uploadResult.url,
      type: fileType,
      mimetype,
      title: originalname,
      userId,
      frameId,
    });
    console.log("✅ Job added:", job.id);

    return {
      jobid: job.id,
      message: "File uploaded successfully, processing in background",
      material: newMaterial,

    };
  } catch (err: any) {
    throw new Error("Adding study material failed: " + err.message);
  }
};


export const addLinkStudyMaterialsToFrameService = async (
  frameId: string,
  userId: string,
  link: string
) => {
  try {
    // Save initial record in DB (status = pending)
    //check if link is ytube link or webpage link
    const isYouTubeLink = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(link);
    const materialType = isYouTubeLink ? "YTLink" : "webpageLink";

    //construct a title from the link with proper single word
    const title = generateTitleFromLink(link);

    const [newMaterial] = await db
      .insert(study_material)
      .values({
        user_id: userId,
        frame_id: frameId,
        title: title,
        type: materialType,
        url: link,
        imagekit_id: null,
        processed_status: "pending",
        ai_generated_summary: null,
        embeddings: null,
      })
      .returning();

    // Push job to Redis queue
    const job = await materialQueue.add("material-processing", {

      materialId: newMaterial?.id,
      url: link,
      type: materialType,
      mimetype: null,
      title: title,
      userId,
      frameId,
    });
    console.log("✅ Job added:", job.id);

    return {
      jobid: job.id,
      message: "Link added successfully, processing in background",
      material: newMaterial,

    };
  } catch (err: any) {
    throw new Error("Adding link study material failed: " + err.message);
  }
}


export const chatInFrameService = async function* (
  query: string,
  userId: string,
  frameId: string,
  canRetrieve: boolean
) {
  // Save user query
  await db.insert(massage).values({
    frame_id: frameId,
    user_id: userId,
    role: "user",
    content: query,
  });

  const history = await getContextForChat(frameId);


  // Retrieval (if needed)
  let contextText = "";
  let aiSummary;
  if (canRetrieve) {
    if (shouldRetrieve(query)) {
      aiSummary = getaiGeneratedSummary(userId, frameId)

      const context = await searchEmbeddings(query, userId, frameId);
      contextText = `Here are the relevant study material snippets:\n${context
        .map((c) => c.pageContent)
        .join("\n---\n")}`;
    } else {
      contextText = `No new study material retrieved — rely on conversation history.`;
    }
  }

  // Call streaming LLM
  let fullAnswer = "";
  for await (const chunk of await llmService(query, contextText, history, aiSummary)) {
    fullAnswer += chunk;
    yield chunk; // stream out partials
  }

  // Save full AI answer at end
  await db.insert(massage).values({
    frame_id: frameId,
    user_id: userId,
    role: "assistant",
    content: fullAnswer,
  });
};


export const massagesInFrameService = async (frameId: string) => {
  const msgs = await db
    .select()
    .from(massage)
    .where(eq(massage.frame_id, frameId))
    .orderBy(desc(massage.created_at))
    .limit(100);
  return msgs.reverse();
};


const getContextForChat = async (frameId: string) => {
  const msgs = await db
    .select()
    .from(massage)
    .where(eq(massage.frame_id, frameId))
    .orderBy(desc(massage.created_at))
    .limit(40);

  return msgs.reverse().map(m => ({
    role: m.role,
    content: m.content,
  }));
};

const getaiGeneratedSummary = async(userId:string, frameId: string)=>{
  const material = await db
  .select({
    title: study_material.title,
    ai_generated_summary: study_material.ai_generated_summary,
  })
  .from(study_material)
  .where(and(eq(study_material.frame_id, frameId), eq(study_material.user_id, userId)))

  let finalSummary = "";
  material.forEach((m)=>{
    if(m.ai_generated_summary){
      finalSummary += `Title: ${m.title}\nSummary: ${m.ai_generated_summary}\n\n`;
    }
  })
  console.log("Final AI Generated Summary: ", finalSummary);
  return finalSummary;
}

export const frameStudyMaterialsService = async(frameId:string, userId:string)=>{
  try{
    const materials =  await db
    .select({
      id: study_material.id,
      title: study_material.title,
      type: study_material.type,
      url: study_material.url,
      processed_status: study_material.processed_status,
      ai_summary: study_material.ai_generated_summary,
      createdAt: study_material.created_at,
    })
    .from(study_material)
    .where(and(eq(study_material.frame_id, frameId), eq(study_material.user_id, userId)));

    return materials;
  }catch{
    throw new Error("Failed to fetch study materials for frame");
  }
}