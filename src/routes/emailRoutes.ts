import { Router } from "express";
import {
  getAllEmails,
  getEmail,
  scheduleMail,
} from "../controllers/emailController";

const router = Router();

router.post("/schedule-email", scheduleMail);
router.get("/scheduled-emails/:id", getEmail);
router.get("/scheduled-emails/", getAllEmails);

export default router;
