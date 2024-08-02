import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import cron from "node-cron";
import { isUUID } from "validator";

const prisma = new PrismaClient();

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

// post api to schedule the mail
export const scheduleMail = async (req: Request, res: Response) => {
  const {
    recipientEmail,
    scheduledDateTime,
    emailBody,
    subject,
    recurring,
    recurrenceType,
    attachments,
  } = req.body;

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
    const scheduleJob = (emailData: typeof email) => {
      const cronExpression = getCronExpression(emailData);
      cron.schedule(cronExpression, () => {
        console.log("From cron ");
        sendEmail(emailData);
      });
    };

    scheduleJob(email);

    res.status(200).json({
      email,
      message: "Email scheduled successfully",
    });
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).json({ error: "Failed to schedule email" });
  }
};

const sendEmail = async (emailData: any) => {
  const mailOptions: MailOptions = {
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
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const getCronExpression = (emailData: any): string => {
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

export const getEmail = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isUUID(id)) {
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
    } else {
      res.status(500).json({
        email: [],
        message: "No email exist with this id",
      });
    }
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).json({ error: "Failed to schedule email" });
  }
};

export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const emails = await prisma.email.findMany({});

    if (emails) {
      res.status(200).json({
        emails,
        message: "Retrived all the email successfully",
      });
    }
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).json({ error: "Failed to schedule email" });
  }
};
