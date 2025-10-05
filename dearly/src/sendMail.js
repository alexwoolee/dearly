import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const imgPath = path.join(__dirname, "assets", "IMG_5370.jpeg");


async function main() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

const CID = "img1";
const base64Data = fs.readFileSync(imgPath).toString("base64");
console.log(base64Data)


await transporter.sendMail({
  from: process.env.MAIL_SENDER,
  to: process.env.MAIL_RECEIVER,
  subject: "Dearly",
  html: `<p>Hi!</p><img src="cid:${CID}" width="225" height="225" alt="Bird">`,
  attachments: [{
    filename: "IMG_5370.jpeg",           
    content: Buffer.from(base64Data, "base64"),
    cid: CID,
    contentType: "image/jpeg",       
  }],
});


  //console.log("Message sent:", info.messageId);
}

main().catch(console.error);
