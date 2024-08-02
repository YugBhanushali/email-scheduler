import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import cron from "node-cron";

const prisma = new PrismaClient();

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_MAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

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
      cron.schedule(cronExpression, () => sendEmail(emailData));
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
    attachments: emailData.attachmentsLinks.map((link: string) => ({
      path: link,
    })),
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
      return `${minute} * * * *`;
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
