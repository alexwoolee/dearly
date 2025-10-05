import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Determine config file path
const configFilePath = process.argv[2] 
  ? path.resolve(process.cwd(), process.argv[2]) // If provided, use the path from command line argument
  : path.join(__dirname, "mail.json"); // Default to mail.json in the same directory

const configRawText = fs.readFileSync(configFilePath, "utf8");
let emailsData;
try {
  const emailsData = JSON.parse(configRawText);
  emailsData = Array.isArray(parsedJson) ? parsedJson : (parsedJson.records || [parsedJson]);
} catch {
  emailsData = configRawText.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(JSON.parse);
}

function getMineType(filename) {
  const ext = path.extname(filename).toLowerCase(); // Get file extension
  if (ext === ".png")  return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream"; // Default fallback
}

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


for (const record of emailsData) {
  const assetsDir = record.assetsDir || "assets"; // Directory containing assets (Change based on input)
  const recipientsList = Array.isArray(record.recipients)
      ? record.recipients
      : (record.receiver ? [record.receiver] : []);
  const emailSubject = record.subject || "Dearly"; // Email subject (Change based on input)
  //const greeting = record.greeting ?? (record.name ? `Hi ${record.name}!` : "Hi!"); // Greeting text (Change based on input)
  //Change greeting text based on vibe/tone with gemini API
  const signoffSignature  = record.signoffName || process.env.MAIL_SIGNOFF_NAME;
  const imageFiles = Array.isArray(record.files) ? record.files : (record.file ? [record.file] : []); // Image files to embed (Change based on input)

  const inLineImages = imageFiles.map((file, i) => {
    const assetFilePath = path.join(__dirname, assetsDir, file);
    const base64Data = fs.readFileSync(assetFilePath).toString("base64");
    const contentId = 'img${Date.now()}_${i+1}'; // Unique content ID
    return {
      filename: file,
      content: Buffer.from(base64Data, "base64"),
      cid: contentId,
      contentType: getMineType(file),
    };
  });
  
  const htmlImageTags = inLineImages
    .map(img => `<img src="cid:${img.cid}" width="225" height="225" alt="${img.filename}" style="display:block;margin:0 auto 16px;" /><br/>`)
    .join("");

  const messageHtml = record.message
      ? `<p style="margin:0 0 12px 0;">${record.message}</p>`
      : "";
  
  await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to: recipientsList,
      subject: emailSubject,
      html: `
        <div style="text-align:center;">
          <p style="margin:0 0 12px 0;">Hi!</p>
          ${messageHtml}
          ${htmlImageTags}
          <p style="margin:16px 0 0 0;">${signoffSignature}</p>
        </div>
      `, // Replace Hi! with ${greeting} with gemini generated greeting
      attachments: inLineImages,
    });

    console.log(`Sent: subject="${emailSubject}" to ${recipientsList.join(", ")}`);
  }
}

main().catch(console.error);


// Manual Mode - for testing
// const files = ["bird.jpeg", "bird.png"]; // List of image files to embed (Change based on input)
// //To map each image type to its corresponding type
// const attachments = files.map((file, i) => {
//   const p = path.join(__dirname, "assets", file);
//   const base64 = fs.readFileSync(p).toString("base64");

//   const ext = path.extname(file).toLowerCase(); // Get file extension
//   const contentType = // Determine content type based on extension
//     ext === ".png"  ? "image/png"  :
//     ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
//     ext === ".gif" ? "image/gif" :
//     ext === ".webp" ? "image/webp" : "application/octet-stream";

//   return {
//     filename: file,
//     content: Buffer.from(base64, "base64"),
//     cid: `img${i + 1}`,     // unique cid per image
//     contentType,
//   };
// });

// const htmlImages = attachments 
//   .map(a => `<img src="cid:${a.cid}" width="225" height="225" alt="${a.filename}" style="display:block;margin:0 auto 16px;" /><br/>`)
//   // Join all images into a single HTML string
//   .join("");

// const recipients = [ // Recipients list (Change based on input)
//   'dearlymailtesting@gmail.com',
// ];

// await transporter.sendMail({
//   from: process.env.MAIL_SENDER,
//   to: recipients,
//   subject: "Dearly",
//   html: `<div style="background:#000;color:#fff;padding:24px;text-align:center;"> 
//         <p style="margin:0 0 12px 0;color:#fff; font-size:24px; font-weight:700;">Hi!</p>${htmlImages}<br/>
//         <p style="margin:16px 0 0 0;color:#fff;">Best regards,<br/>Alex Lee</p>
//         </div>`, // Change style based on vibe/tone
//   attachments,
// });
//   //console.log("Message sent:", info.messageId);


