import { OllamaEmbeddings } from "./ollamaEmbeddingModel.js";
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

const embeddings = new OllamaEmbeddings("nomic-embed-text");

  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  await vectorStore.addDocuments(enrichedDocs);

  console.log(
    `✅ Stored ${docs.length} docs for user=${userId}, chat=${frameId}, type=${type}`
  );
};


export const searchEmbeddings = async (
  query: string,
  userId: string,
  frameId: string,
  materialId?: string
) => {
  const embeddings = new OllamaEmbeddings("nomic-embed-text");

  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  const filter: any = {
    user_id: userId,
    frame_id: frameId,
  };
  if (materialId) {
    filter.material_id = materialId;
  }

  // Search top 5 chanks
  const results = await vectorStore.similaritySearch(query, 3, filter);
  console.log(results)

  return results;
};

export const deleteEmbeddingsForMaterial = async (userId:string, frameId:string) =>{
  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  const filter: any = {
    user_id: userId,
    frame_id: frameId,
  };

  await pineconeIndex.deleteMany({
    deleteAll: false,
    filter,
  });

  console.log(`Deleted embeddings for material ${userId} in frame ${frameId}`);
}