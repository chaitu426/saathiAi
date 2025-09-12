import express from "express";
import { addLinkStudyMaterialsToFrame, addStudyMaterialsToFrame, chatInFrame, createFrame, deleteFrame, listFrames, massagesInFrame, viewFrame } from "../controllers/frameController.js";
import {authenticateJWT} from "../middlewares/authMiddleware.js";
import multer from "multer";


const upload = multer({ storage: multer.memoryStorage() });

const frameRoute = express.Router();

frameRoute.post("/create",authenticateJWT, createFrame);

frameRoute.delete("/delete/:frameId",authenticateJWT, deleteFrame);

frameRoute.get("/list",authenticateJWT, listFrames);

frameRoute.get("/view/:frameId",authenticateJWT, viewFrame);

frameRoute.post("/:frameId/chat", authenticateJWT, chatInFrame);

// //we only call this route when user reload frame and opens the frame to build the convertation history
frameRoute.get("/:frameId/massages", authenticateJWT, massagesInFrame);

// Route to add study materials to a frame
frameRoute.post("/:frameId/materials", authenticateJWT, upload.array("file",3), addStudyMaterialsToFrame);

//Route to take yt video link and website link to add study materials to a frame
frameRoute.post("/:frameId/materials/link", authenticateJWT, addLinkStudyMaterialsToFrame);





export default frameRoute; 