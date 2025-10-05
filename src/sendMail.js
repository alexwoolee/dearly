import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 8000;
app.use(express.json({ limit: "10mb" }));

const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Fixed test email function with 3 images and alternating paragraphs, subject as H1
async function sendTestEmail({
  to = "dearlymailtesting@gmail.com",
  subject = "Greetings from Osaka!",
  signoffName = "Sara",
  files = ["fixed-1.jpg", "fixed-2.jpg", "fixed-3.jpg"], // the 3 images
  assetsDir = "assets"
}) {
  const paragraphs = [
    "Hey Sam! I wanted to share some amazing views from Osaka. The city lights at night are just breathtaking—so many colors and energy!",
    "Next, I visited Osaka Castle. It's stunning and so full of history. Walking around the grounds really made me feel like I was back in time.",
    "Finally, the high city views are incredible! Looking out over Osaka from the skyscrapers gives such a different perspective. I wish you could see it with me!"
  ];

  // Prepare inline images
  const inlineImages = files.map((file, i) => {
    const assetFilePath = path.join(__dirname, assetsDir, file);
    const base64Data = fs.readFileSync(assetFilePath).toString("base64");
    const ext = path.extname(file).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      ext === ".gif" ? "image/gif" :
      ext === ".webp" ? "image/webp" :
      "application/octet-stream";

    return {
      filename: file,
      content: Buffer.from(base64Data, "base64"),
      cid: `img${i + 1}`,
      contentType,
    };
  });

  // Build HTML: subject as H1, then paragraph → image → paragraph → image → paragraph → image
  let htmlBody = `
    <div style="background:#fef9f0;padding:24px;margin:0 auto;max-width:600px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);font-family:sans-serif;">
      <h1 style="font-size:28px;font-weight:bold;margin-bottom:24px;text-align:center;">${subject}</h1>
  `;

  paragraphs.forEach((para, i) => {
    htmlBody += `<p style="font-size:18px;margin:16px 0;text-align:left;">${para}</p>`;
    if (inlineImages[i]) {
      const img = inlineImages[i];
      htmlBody += `<img src="cid:${img.cid}" width="100%" style="display:block;margin:0 auto 24px;border-radius:8px;" alt="${img.filename}" />`;
    }
  });

  htmlBody += `<p style="margin:16px 0 0 0;text-align:left;">Best regards,<br/>${signoffName}</p>`;
  htmlBody += `</div>`;

  const info = await mailTransporter.sendMail({
    from: process.env.MAIL_SENDER,
    to,
    subject,
    html: htmlBody,
    attachments: inlineImages
  });

  return info.messageId;
}

// Endpoint for sending email via POST
app.post("/send", async (req, res) => {
  try {
    const messageId = await sendTestEmail(req.body);
    res.json({ ok: true, messageId });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.get("/", (_req, res) => res.send("Mailer is running"));

app.listen(PORT, () => console.log(`Mailer listening on :${PORT}`));

// Immediately send a test email
sendTestEmail({})
  .then(id => console.log("Test email sent, messageId:", id))
  .catch(err => console.error("Error sending test email:", err));
