"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailController_1 = require("../controllers/emailController");
const router = (0, express_1.Router)();
//schedules the mail
router.post("/schedule-email", emailController_1.scheduleMail);
// get the mail details using the id
router.get("/scheduled-emails/:id", emailController_1.getEmail);
// get all the mails
router.get("/scheduled-emails", emailController_1.getAllEmails);
//delete the mail using the mail id
router.delete("/scheduled-emails/:id", emailController_1.deleteEmail);
exports.default = router;
