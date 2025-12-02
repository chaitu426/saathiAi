import { Worker } from "bullmq";
import { db } from "../config/db.js";
import { study_material } from "../db/schema.js";
import { extractPDF} from "../utils/hybridPdfProcessor.js";
import { runOCR } from "../utils/ocrProcesser.js";
import {ytextractor} from "../utils/ytTranscript.js"
import {webpageExtractor} from "../utils/webpageExtractor.js"
import { eq } from "drizzle-orm";
import { textSplitter } from "../utils/textSpliter.js";
import { generateEmbeddings } from "../services/embeddingService.js";
import { getIO } from "./socket.js";
import { llmforSummaryService } from "../services/llmService.js";

const QUEUE_NAME = "material-processing";

const materialWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { materialId, url, type, userId, frameId } = job.data;
    const io = getIO();

    const emitProgress = async (step:any, message:any) => {
      await job.updateProgress({ step, message });
      io.emit(`job-progress-${job.id}`, { step, message });
    };

    try {
      await emitProgress("started", "Processing started...");
      let text;

      if (type === "pdf") {
        await emitProgress("extracting", "Extracting text");
        text = await extractPDF(url);
      } else if (type === "image") {
        await emitProgress("ocr", "Running OCR");
        text = await runOCR(url);
      } else if (type === "YTLink") {
        await emitProgress("yt", "Fetching YouTube");
        text = await ytextractor(url);
      } else if (type === "webpageLink") {
        await emitProgress("webpage", "Scraping webpage");
        text = await webpageExtractor(url);
      }

      //make sure text is not empty
      if (!text) {
        throw new Error("No text extracted from the material.");
      }

      //split text into chunks and store in another table if needed
      await emitProgress("splitting", "Splitting text");
      const docs = await textSplitter(text);

      //embeddings
      await emitProgress("embedding", "creating embeddings");
      await generateEmbeddings(docs, userId, frameId, materialId, type);

      //create ai generated summary
      const aiSummary = await llmforSummaryService(text);

      await db
        .update(study_material)
        .set({
          processed_status: "completed",
          ai_generated_summary: aiSummary,
        })
        .where(eq(study_material.id, materialId));
        await emitProgress("done", "processed successfully!")
      console.log(`Material ${materialId} processed successfully.`);
    } catch (err: any) {
      await db
        .update(study_material)
        .set({ processed_status: "failed" })
        .where(eq(study_material.id, materialId));
      await emitProgress("failed", `Failed: ${err.message}`);
      console.error(`Processing failed for material ${materialId}:`, err);
      throw err; // rethrow so BullMQ marks it as failed
    }
  },
  {
    connection: { host: "127.0.0.1", port: 6379 },
  }
);

// Optional: lifecycle logging
materialWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

materialWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export default materialWorker;
