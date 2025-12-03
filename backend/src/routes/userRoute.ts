import express from "express";
import {userRegister, userLogin, userProfile, addUserDetail, updateUserDetail} from "../controllers/userController.js";
import {authenticateJWT} from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);

userRouter.post("/login", userLogin);

userRouter.post("/details", authenticateJWT, addUserDetail);

userRouter.put('/updatedetails', authenticateJWT, updateUserDetail);

userRouter.get("/profile", authenticateJWT, userProfile);

//this route checks if the token is still valid and returns appropriate response if expired then 401 else 200 so frontend can handle token expiry gracefully
userRouter.get("/tokenexpiry", authenticateJWT, (req, res) => {
    res.status(200).json({message: "Token is valid"});
});

export default userRouter;