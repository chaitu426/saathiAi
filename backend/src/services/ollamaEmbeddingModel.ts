import axios from "axios";
import { EmbeddingsInterface } from "@langchain/core/embeddings";

export class OllamaEmbeddings implements EmbeddingsInterface {
  private model: string;
  private baseUrl: string;

  constructor(model = "nomic-embed-text", baseUrl = "http://localhost:11434") {
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      const embedding = await this.getEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.getEmbedding(text);
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(`${this.baseUrl}/api/embeddings`, {
      model: this.model,
      prompt: text,
    });
    return response.data.embedding;
  }
}
