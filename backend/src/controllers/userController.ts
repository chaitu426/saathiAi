import { NextFunction, Request, Response } from 'express';
import { db } from '../config/db.js';
import { frame, user } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authSchema } from "../validator/authValidator.js";
import { registerService, loginService } from '../services/authService.js';
import {detailsSchema} from "../validator/detailsValidator.js";
import {userDetails} from "../db/schema.js";

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ error: 'Invalid input', details: parsedData.error.issues });
        }

        const result = await registerService(parsedData.data);
        res.status(200).json(result);
    }
    catch (err: any) {
        if (err.message === 'internal server error') {
            return res.status(401).json({ error: 'internal server error' });
        }
        next(err);
    }
}

export const userLogin = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const parsedData = authSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ error: 'Invalid input', details: parsedData.error.issues });
        }

        const result = await loginService(parsedData.data);
        res.status(201).json(result);
    }
    catch (err: any) {
        if (err.message === 'Invalid credentials') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        next(err);
    }
}

export const userProfile = async (req: Request, res: Response, next:NextFunction) => {
    try {
        //take user id from req.user which is set in authMiddleware
        const userId = (req as any).user?.id;
        console.log("User ID from token:", userId);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const result = await db.select().from(user).where(eq(user.id, userId as string));
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result[0]);
    }
    catch (err) {
        next(err);
    }
}


export  const addUserDetail = async (req: Request, res: Response, next:NextFunction) => {
    
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const parsedData = detailsSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: 'Invalid input', details: parsedData.error.issues });
    }
    try {

        const alreadyExists = await db.select().from(userDetails).where(eq(userDetails.user_id, userId));
        if (alreadyExists.length > 0) {
            return res.status(400).json({ error: 'User details already exist' });
        }
        const result = await db.insert(userDetails).values({
            user_id: userId,
            course: parsedData.data.course,
            branch: parsedData.data.branch,
            year: parsedData.data.year,
            learning_goals: parsedData.data.learning_goals
        }).returning();

        const firstFrame = await db.insert(frame).values({
              user_id: userId,
              title: "Welcome",
              description: "first frame",
            }).returning({
              id: frame.id,
              title: frame.title,
              description: frame.description,
              created_at: frame.created_at,
              updated_at: frame.updated_at,
            });
        res.status(201).json({ message: 'User details added successfully', data: result[0], frame: firstFrame[0] });
    }
    catch (err) {
        next(err);
    }
}

export const updateUserDetail = async (req: Request, res: Response, next:NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const parsedData = detailsSchema.partial().safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: 'Invalid input', details: parsedData.error.issues });
    }
    try {
        const alreadyExists = await db.select().from(userDetails).where(eq(userDetails.user_id, userId));
        if (alreadyExists.length === 0) {
            return res.status(404).json({ error: 'User details not found' });
        }
        const result = await db.update(userDetails).set({
            course: parsedData.data.course || alreadyExists[0]?.course,
            branch: parsedData.data.branch || alreadyExists[0]?.branch,
            year: parsedData.data.year || alreadyExists[0]?.year,
            learning_goals: parsedData.data.learning_goals || alreadyExists[0]?.learning_goals,
            updated_at: new Date()
        }).where(eq(userDetails.user_id, userId)).returning();
        res.status(200).json({ message: 'User details updated successfully', data: result[0] });
    }
    catch (err) {
        next(err);
    }
}



//helper functions (repository functions) for database operations can be added here
//service functions for business logic can be added here

export const findUserByEmail = async (email: any) => {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0] || null;
}; 