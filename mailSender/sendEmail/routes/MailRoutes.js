const express = require("express");
const MailRouter = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

MailRouter.get("/send", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: '"Mail checking app" <girija.kangutkar@gmail.com>',
      to: "kangutkargirija075@gmail.com",
      subject: "Sending mail through nodemailer",
      //   text: "Hello world?",
      html: "<b>This is a testing Mail sent by NEM student, no need to reply</b>",
    });

    console.log("Message sent:", info.messageId);
    res.status(200).json({ msg: "Email sent", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ msg: "Failed to send email" });
  }
});

module.exports = MailRouter;
