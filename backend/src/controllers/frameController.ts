import { Request, Response, NextFunction } from 'express';
import {frameSchema} from "../validator/frameValidator.js";
import { addLinkStudyMaterialsToFrameService, addStudyMaterialsToFrameService, chatInFrameService, frameCreationService, frameDeletionService, frameListService , massagesInFrameService, singleFrameService} from '../services/frameService.js';
import jwt from 'jsonwebtoken';
import {environment} from "../config/environment.js";

const JWT_SECRET = environment.jwtsecret;


export const createFrame = async (req: Request, res: Response, next:NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const parsedData = frameSchema.safeParse(req.body);
    if( !parsedData.success){
        return res.status(400).json({error: "Invalid input", details: parsedData.error.issues});
    }

    try{
        const result = await frameCreationService(parsedData.data, userId);
        res.status(200).json(result);
    }
    catch(err){
        next(err);
    }

};

export const deleteFrame = async (req: Request, res: Response, next:NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const frameId = req.params.frameId;
    if(!frameId){
        return res.status(400).json({error: "Frame ID is required"});
    }
    try{
        // Call the service to delete the frame
        const result = await frameDeletionService(frameId, userId);
        if(result === 1){
            return res.status(200).json({message: "Frame deleted successfully"});
        }
        return res.status(500).json({error: "Failed to delete frame"});
    }
    catch(err){
        next(err);
    }
};

export const listFrames = async (req: Request, res: Response, next:NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try{
        // Call the service to list frames for the user
        const result = await frameListService(userId);
        if(!result){
            return res.status(404).json({error: "No frames found"});
        }
        res.status(200).json(result);
        
    }
    catch(err){
        next(err);
    }

};

export const viewFrame = async (req: Request, res: Response, next:NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const frameId = req.params.frameId;
    if(!frameId){
        return res.status(400).json({error: "Frame ID is required"});
    }
    try{
        const frame = await singleFrameService(frameId, userId);
        if(!frame){
            return res.status(404).json({error: "Frame not found"});
        }
        res.status(200).json(frame);
    }
    catch(err){
        next(err);
    }
};



export const chatInFrame = async (req: Request, res: Response, next: NextFunction) => {


  const userId = (req as any).user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
    
  }

  const frameId = req.params.frameId;
  if (!frameId) {
    return res.status(400).json({ error: "Frame ID is required" });
  }

  const query  = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Message is required" });
  }
  const isRagEnabled = req.query.rag === 'true' ? true : false;

  try {
    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    // Call service (async generator)
    for await (const token of chatInFrameService(query as string, userId, frameId, isRagEnabled)) {
      res.write(`data: ${token}\n\n`);
    }

    // End stream
    res.write("event: done\ndata: end\n\n");
    res.end();
  } catch (error) {
    next(error);
  }
};



export const massagesInFrame = async (req: Request, res: Response, next:NextFunction) => {
    
    const frameId = req.params.frameId;
    if (!frameId) {
      return res.status(400).json({ error: "Frame ID is required" });
    }
  
    try {
      const result = await massagesInFrameService(frameId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
}


export const addStudyMaterialsToFrame = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    const frameId = req.params.frameId;
    if (!frameId) {
      return res.status(400).json({ error: "Frame ID is required" });
    }
  
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ error: "No files uploaded" });
    }
  
    try {
      const results = await Promise.all(
        (req.files as Express.Multer.File[]).map((file) =>
          addStudyMaterialsToFrameService(
            frameId,
            userId,
            file.buffer,
            file.originalname,
            file.mimetype
          )
        )
      );
  
      res.status(200).json({ success: true, materials: results });
    } catch (error) {
      next(error);
    }
  };
  


export const addLinkStudyMaterialsToFrame = async (req: Request, res: Response, next:NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const frameId = req.params.frameId;
    if(!frameId){
        return res.status(400).json({error: "Frame ID is required"});
    }
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL, type, and title are required' });
    }

    try {
        // For link-based materials, we skip the upload step
        const result = await addLinkStudyMaterialsToFrameService(frameId, userId, url);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

