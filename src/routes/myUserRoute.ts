import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

router.get("/", 
    jwtCheck, 
    jwtParse,
    MyUserController.getCurrentUser)

// /api/my/user
router.post("/",
    jwtCheck,
    MyUserController.createCurrentUser)

router.put("/",
    jwtCheck,
    jwtParse,
    MyUserController.updateCurrentUser);
    
export default router;
