import nodemailer from "nodemailer";

async function main() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dearlymail2025@gmail.com",
      pass: "btbu qwxu atlv xzbt",
    },
  });

  const info = await transporter.sendMail({
    from: "dearlymail2025@gmail.com",
    to: "dearlymailtesting@gmail.com",
    subject: "Dearly",
    text: "This is a test email. Seeing this meant success",
  });

  console.log("Message sent:", info.messageId);
}

main().catch(console.error);
