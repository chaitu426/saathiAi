import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { v4 as uuidv4 } from "uuid";

export const generateEmbeddings = async (
  docs: any,
  userId: string,
  frameId: string,
  materialId: string,
  type: string,
) => {
  // 1. Add metadata to each doc
  const enrichedDocs = docs.map((doc: any, i:any) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      user_id: userId,
      frame_id: frameId,
      material_id: materialId,
      doc_type: type,
      createdAt: new Date().toISOString(),
      chunk_index: i,
    },
    id: `${userId}_${frameId}_${materialId}_${i}_${uuidv4()}`,
  }));

  //embedding model
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
  });

  //Init Pinecone
  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  //Create a LangChain vector
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  //Store embeddings
  await vectorStore.addDocuments(enrichedDocs);

  console.log(
    `✅ Stored ${docs.length} docs for user=${userId}, chat=${frameId}, type=${type}`
  );
};


export const searchEmbeddings = async (
  query: string,
  userId: string,
  frameId: string,
  materialId?: string // optional, if you want to narrow further
) => {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
  });

  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  // Build filter
  const filter: any = {
    user_id: userId,
    frame_id: frameId,
  };
  if (materialId) {
    filter.material_id = materialId;
  }

  // Search top 5 chunks
  const results = await vectorStore.similaritySearch(query, 3, filter);

  return results;
};

export const deleteEmbeddingsForMaterial = async (userId:string, frameId:string) =>{
  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  // Build filter
  const filter: any = {
    user_id: userId,
    frame_id: frameId,
  };

  // Delete vectors matching the filter
  await pineconeIndex.deleteMany({
    deleteAll: false,
    filter,
  });

  console.log(`🗑️ Deleted embeddings for material ${userId} in frame ${frameId}`);
}