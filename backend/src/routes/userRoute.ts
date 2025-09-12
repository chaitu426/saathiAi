import express from "express";
import {userRegister, userLogin, userProfile, addUserDetail, updateUserDetail} from "../controllers/userController.js";
import {authenticateJWT} from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);

userRouter.post("/login", userLogin);

userRouter.post("/details", authenticateJWT, addUserDetail);

userRouter.put('/updatedetails', authenticateJWT, updateUserDetail);

userRouter.get("/profile", authenticateJWT, userProfile);

export default userRouter;