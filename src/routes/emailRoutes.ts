import { Router } from "express";
import { scheduleMail } from "../controllers/emailController";

const router = Router();

router.post("/send-email", scheduleMail);

export default router;
