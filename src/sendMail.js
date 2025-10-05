import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


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

const files = ["bird.jpeg", "bird.png"]; // List of image files to embed (Change based on input)

//To map each image type to its corresponding type
const attachments = files.map((file, i) => {
  const p = path.join(__dirname, "assets", file);
  const base64 = fs.readFileSync(p).toString("base64");

  const ext = path.extname(file).toLowerCase(); // Get file extension
  const contentType = // Determine content type based on extension
    ext === ".png"  ? "image/png"  :
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
    ext === ".gif" ? "image/gif" :
    ext === ".webp" ? "image/webp" : "application/octet-stream";

  return {
    filename: file,
    content: Buffer.from(base64, "base64"),
    cid: `img${i + 1}`,     // unique cid per image
    contentType,
  };
});

const htmlImages = attachments 
  .map(a => `<img src="cid:${a.cid}" width="225" height="225" alt="${a.filename}" style="display:block;margin:0 auto 16px;" /><br/>`)
  // Join all images into a single HTML string
  .join("");

const recipients = [ // Recipients list (Change based on input)
  'dearlymailtesting@gmail.com',
];

await transporter.sendMail({
  from: process.env.MAIL_SENDER,
  to: recipients,
  subject: "Dearly",
  html: `<p>Hi!</p>${htmlImages}<br/><p>Best regards,<br/>Alex Lee</p>`,
  attachments,
});
  //console.log("Message sent:", info.messageId);
}

main().catch(console.error);
