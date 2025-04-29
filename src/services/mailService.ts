import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpEmailTemplate } from "../templates/emailTemplate";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_HOST,
  // host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // <-- This fixes the self-signed certificate issue
  },
});

export const sendOtpEMail = async (to: string, fullName: string, otp: number) => {
  const html = otpEmailTemplate(otp, fullName);
  const info = await transporter.sendMail({
    from: `"LD Case " <${process.env.MAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html,
  });

  console.log("Message sent: %s", info.messageId);
};
