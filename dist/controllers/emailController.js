"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmail = exports.getAllEmails = exports.getEmail = exports.scheduleMail = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_cron_1 = __importDefault(require("node-cron"));
const validator_1 = require("validator");
const prisma = new client_1.PrismaClient();
const scheduledJobs = {};
const mailTransporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});
// post api to schedule the mail
const scheduleMail = async (req, res) => {
    const { recipientEmail, scheduledDateTime, emailBody, subject, recurring, recurrenceType, attachments, } = req.body;
    try {
        const email = await prisma.email.create({
            data: {
                recepientEmail: recipientEmail,
                body: emailBody,
                subject: subject,
                recurring: recurring,
                recurrenceType: recurrenceType,
                scheduledTime: new Date(scheduledDateTime),
                scheduledDate: new Date(scheduledDateTime),
                attachmentsLinks: attachments || [],
            },
        });
        // Schedule the email
        const scheduleJob = (emailData) => {
            const cronExpression = getCronExpression(emailData);
            const job = node_cron_1.default.schedule(cronExpression, () => {
                sendEmail(emailData);
            });
            scheduledJobs[emailData.id] = job;
        };
        scheduleJob(email);
        res.status(200).json({
            email,
            message: "Email scheduled successfully",
        });
    }
    catch (error) {
        console.error("Error scheduling email:", error);
        res.status(500).json({ error: "Failed to schedule email" });
    }
};
exports.scheduleMail = scheduleMail;
const sendEmail = async (emailData) => {
    const mailOptions = {
        from: process.env.GOOGLE_MAIL,
        to: emailData.recepientEmail,
        subject: emailData.subject,
        text: emailData.body,
        // attachments: emailData.attachmentsLinks.map((link: string) => ({
        //   path: link,
        // })),
    };
    try {
        await mailTransporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        if (!emailData.recurring) {
            await prisma.email.delete({ where: { id: emailData.id } });
        }
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
};
const getCronExpression = (emailData) => {
    const date = new Date(emailData.scheduledTime);
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    switch (emailData.recurrenceType) {
        case "daily":
            return `* * * * *`;
        // case "daily":
        //   return `${minute} ${hour} * * *`;
        case "weekly":
            return `${minute} ${hour} * * ${dayOfWeek}`;
        case "monthly":
            return `${minute} ${hour} ${dayOfMonth} * *`;
        case "quarterly":
            return `${minute} ${hour} ${dayOfMonth} */3 *`;
        default:
            return `${minute} ${hour} ${dayOfMonth} ${month} *`;
    }
};
const getEmail = async (req, res) => {
    const { id } = req.params;
    if (!(0, validator_1.isUUID)(id)) {
        res.status(500).json({
            message: "Invalid id format",
        });
    }
    try {
        const email = await prisma.email.findUnique({
            where: {
                id: id,
            },
        });
        if (email) {
            res.status(200).json({
                email,
                message: "Retrived the email successfully",
            });
        }
        else {
            res.status(500).json({
                email: [],
                message: "No email exist with this id",
            });
        }
    }
    catch (error) {
        console.error("Error scheduling email:", error);
        res.status(500).json({ error: "Failed to schedule email" });
    }
};
exports.getEmail = getEmail;
const getAllEmails = async (req, res) => {
    try {
        const emails = await prisma.email.findMany({});
        if (emails) {
            res.status(200).json({
                emails,
                message: "Retrived all the email successfully",
            });
        }
    }
    catch (error) {
        console.error("Error scheduling email:", error);
        res.status(500).json({ error: "Failed to schedule email" });
    }
};
exports.getAllEmails = getAllEmails;
const deleteEmail = async (req, res) => {
    const { id } = req.params;
    if (!(0, validator_1.isUUID)(id)) {
        res.status(500).json({
            message: "Invalid id format",
        });
    }
    try {
        // Find the email
        const email = await prisma.email.findUnique({
            where: { id },
        });
        if (!email) {
            return res.status(404).json({ error: "Email not found" });
        }
        // Delete the email from the database
        await prisma.email.delete({
            where: { id },
        });
        console.log("This is cron job" + scheduledJobs);
        // If there's a scheduled job for this email, stop and delete it
        if (scheduledJobs[id]) {
            scheduledJobs[id].stop();
            delete scheduledJobs[id];
        }
        res.status(200).json({ message: "Email deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting email:", error);
        res.status(500).json({ error: "Failed to delete email" });
    }
};
exports.deleteEmail = deleteEmail;
