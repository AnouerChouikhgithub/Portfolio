import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as nodemailer from "nodemailer";

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email",
    pass: "your-app-password",
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
      from: "Portfolio Contact <your-email>",
      to: "your-email",
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
