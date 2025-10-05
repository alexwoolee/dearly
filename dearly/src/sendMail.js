import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
async function main() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_SENDER,
    to: process.env.MAIL_RECEIVER,
    subject: "Dearly",
    text: "This is a test email. Seeing this meant success",
  });

  console.log("Message sent:", info.messageId);
}

main().catch(console.error);
