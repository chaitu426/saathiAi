import { FrameInput } from "../validator/frameValidator";
import { db } from "../config/db.js";
import { frame, study_material, massage} from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { uploadToImageKit } from "./uploadService.js";
import { Queue } from "bullmq";
import {generateTitleFromLink} from "../utils/urlToTitle.js"
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

    //also delete the study materials associated with the frame and vector embeddings in pinecone
    await db.delete(study_material).where(eq(study_material.frame_id, frameId));


    const result = await db
      .delete(frame)
      .where(
        and(
          eq(frame.id, frameId),
          eq(frame.user_id, userId)
        )
      );
      //call pinecone to delete the embeddings associated with the frameId
      //deleteEmbeddingsForMaterial(userId, frameId);

      //delete massages associated with the frame
      await db.delete(massage).where(eq(massage.frame_id, frameId));

    // result could be { count: number } depending on db adapter
    if (!result || ((result as any).count !== undefined && (result as any).count === 0)) {
      throw new Error("Frame not found or unauthorized");
    }

    return 1; // success
  } catch (error) {
    console.error("Error deleting frame:", error);
    throw error;
  }
};

export const frameListService = async (userId: string) => {
  try {
    const frames = await db.select().from(frame).where(eq(frame.user_id, userId));
    return frames;
  }
  catch (err) {
    throw new Error("Frame listing failed");
  }
}

export const singleFrameService = async (frameId: string, userId: string) => {
  try {
    const frames = await db.select().from(frame).where(and(eq(frame.user_id, userId), eq(frame.id, frameId)));
    return frames[0];
  }
  catch (err) {
    throw new Error("Frame retrieval failed");
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
        imagekit_id:uploadResult.fileId,
        processed_status: "pending",
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
        imagekit_id:null,
        processed_status: "pending",
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
  frameId: string
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
  if (shouldRetrieve(query)) {
    const context = await searchEmbeddings(query, userId, frameId);
    contextText = `Here are the relevant study material snippets:\n${context
      .map((c) => c.pageContent)
      .join("\n---\n")}`;
  } else {
    contextText = `No new study material retrieved — rely on conversation history.`;
  }

  // Call streaming LLM
  let fullAnswer = "";
  for await (const chunk of await llmService(query, contextText, history)) {
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