import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as nodemailer from "nodemailer";

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "anouer.chouikh2005@gmail.com",
    pass: "pwyb awgi vnzu svgn",
  },
});

// FIRESTORE TRIGGER
export const sendContactEmail = onDocumentCreated(
  "contacts/{id}",
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();

    const mailOptions = {
      from: "Portfolio Contact <anouer.chouikh2005@gmail.com>",
      to: "anouer.chouikh2005@gmail.com",
      subject: `New message from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "N/A"}

Message:
${data.message}
      `,
    };

    await transporter.sendMail(mailOptions);
  });
