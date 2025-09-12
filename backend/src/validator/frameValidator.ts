import {z} from "zod";

export const frameSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(5).max(500),
});

export type FrameInput = z.infer<typeof frameSchema>;