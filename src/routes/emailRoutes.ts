import { Router } from "express";
import {
  deleteEmail,
  getAllEmails,
  getEmail,
  scheduleMail,
} from "../controllers/emailController";

const router = Router();

//schedules the mail
router.post("/schedule-email", scheduleMail);

// get the mail details using the id
router.get("/scheduled-emails/:id", getEmail);

// get all the mails
router.get("/scheduled-emails", getAllEmails);

//delete the mail using the mail id
router.delete("/scheduled-emails/:id", deleteEmail);

export default router;
