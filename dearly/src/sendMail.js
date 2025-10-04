import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dearlymail2025@gmail.com",   // the Gmail you just made
    pass: "btbu qwxu atlv xzbt", // from step 2
  },
});

const info = await transporter.sendMail({
  from: "dearlymail2025@gmail.com",
  to: "diamsterac@gmail.com",        // where you want to receive
  subject: "Dearly",
  text: "This is a test email. Seeing this meant success",
});

console.log("Message sent:", info.messageId);