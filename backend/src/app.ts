import express from "express";
import userRouter from "./routes/userRoute.js";
import frameRouter from "./routes/frameRoute.js";
import cors from "cors";

import "./workers/materialProcessor.js";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { materialQueue } from "./services/frameService.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(materialQueue)],
  serverAdapter,
});

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin/queues", serverAdapter.getRouter());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/frame", frameRouter);




// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

export default app;