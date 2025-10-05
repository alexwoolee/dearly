import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Express app setup
const app  = express();
const PORT = process.env.PORT || 8080;

// Accept JSON payloads up to 10MB
app.use(express.json({ limit: "10mb" }));

// Determine config file path
const configFilePath = process.argv[2] 
  ? path.resolve(process.cwd(), process.argv[2]) // If provided, use the path from command line argument
  : path.join(__dirname, "mail.json"); // Default to mail.json in the same directory

function loadEmailJobsFromFile(configPath) { // Load and parse email jobs from file
  const configText = fs.readFileSync(configPath, "utf8");
  try {
    const parsed = JSON.parse(configText);
    return Array.isArray(parsed) ? parsed : (parsed.records || [parsed]);
  } catch {
    // NDJSON (one JSON object per line)
    return configText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(JSON.parse);
  }
}

function getMimeType(filename) { // Determine MIME type based on file extension
  const ext = path.extname(filename).toLowerCase(); // Get file extension
  if (ext === ".png")  return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream"; // Default fallback
}

async function sendEmailJob(job, transporter) { // Send a single email job
  const assetsDirectory = job.assetsDir || "assets";
  const recipients = Array.isArray(job.recipients)
    ? job.recipients
    : (job.receiver ? [job.receiver] : []);
  if (!recipients.length) throw new Error("Missing receiver/recipients.");
  const subject     = job.subject || "Dearly";
  const signoffName = job.signoffName || process.env.MAIL_SIGNOFF_NAME;
  const imageFiles  = Array.isArray(job.files) ? job.files : (job.file ? [job.file] : []);

  const inlineImages = imageFiles.map((file, i) => { // Image attachments
    const assetFilePath = path.join(__dirname, assetsDirectory, file);
    const base64Data = fs.readFileSync(assetFilePath).toString("base64");
    const contentId = `img${Date.now()}_${i + 1}`; // unique cid
    return {
      filename: file,
      content: Buffer.from(base64Data, "base64"),
      cid: contentId,
      contentType: getMimeType(file),
    };
  });

  const inlineImagesHtml = inlineImages // Embed images in HTML
    .map(img => `<img src="cid:${img.cid}" width="225" height="225" alt="${img.filename}" style="display:block;margin:0 auto 16px;" /><br/>`)
    .join("");

  const messageHtml = job.message // Message body
    ? `<p style="margin:0 0 12px 0;">${job.message}</p>`
    : "";
  
  const info = await transporter.sendMail({ // Send email
    from: process.env.MAIL_SENDER,
    to: recipients,
    subject: subject,
    html: `
      <div style="text-align:center;" background-color=rgb(250, 249, 240);>
        <p style="margin:0 0 12px 0;">Hi!</p>
        ${messageHtml}
        ${inlineImagesHtml}
        <p style="margin:16px 0 0 0;">${signoffName}</p>
      </div>
    `,
    attachments: inlineImages,
  });

  return { messageId: info.messageId, to: recipients };
}

const mailTransporter = nodemailer.createTransport({ // Gmail SMTP
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});

app.post("/send", async (req, res) => { // Accepts single job or array of jobs
  if (!req.body) return res.status(400).json({ results: [{ ok: false, error: "Empty body" }] });
  const payload = req.body;
  const jobs = Array.isArray(payload) ? payload : [payload];

  const results = [];
  for (const job of jobs) {
    try {
      const r = await sendEmailJob(job, mailTransporter);
      results.push({ ok: true, ...r });
    } catch (err) {
      results.push({ ok: false, error: err.message });
    }
  }
  res.json({ results });
});

app.get("/", (_req, res) => res.send("Mailer is running"));
const server = app.listen(PORT, '127.0.0.1', () => {
  const addr = server.address();
  console.log(
    `[http] listening on ${typeof addr === 'string' ? addr : addr.address + ':' + addr.port}`
  );
});

if (process.argv[2]) {
  (async () => {
    const configPath = path.resolve(process.cwd(), process.argv[2]); 
    const emailJobs = loadEmailJobsFromFile(configPath); // Load jobs from specified file
    for (const job of emailJobs) {
      try {
        const r = await sendEmailJob(job, mailTransporter); // Await the result
        console.log(`CLI sent: subject="${job.subject || "Dearly"}" to ${r.to.join(", ")}  (id: ${r.messageId})`);
      } catch (e) {
        console.error("CLI error:", e.message); 
      }
    }
  })();
}


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


