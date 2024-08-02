import { Router } from "express";
import {
  deleteEmail,
  getAllEmails,
  getEmail,
  scheduleMail,
} from "../controllers/emailController";

const router = Router();

router.post("/schedule-email", scheduleMail);
router.get("/scheduled-emails/:id", getEmail);
router.get("/scheduled-emails", getAllEmails);
router.delete("/scheduled-emails/:id", deleteEmail);

export default router;
