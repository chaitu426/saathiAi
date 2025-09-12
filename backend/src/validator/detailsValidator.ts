import {z} from 'zod';

export const detailsSchema = z.object({
    course: z.string().min(1).max(50),
    branch: z.string().min(1).max(50),
    year: z.string().min(0).max(120),
    learning_goals: z.string().min(5).max(100),
});

export type DetailsInput = z.infer<typeof detailsSchema>;
