import nodemailer from "nodemailer";

export const sendNotificationEmail = async (ownerEmail, ownerName, numberPlate) => {
  try {
    // transporter is created here (not at file top) so .env is
    // guaranteed to be loaded by the time this runs
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Gaadi Notify" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: "Your car is blocking someone 🚗",
      html: `
        <p>Hi ${ownerName},</p>
        <p>Someone has reported that your car (<strong>${numberPlate}</strong>) is blocking them.</p>
        <p>Please move your vehicle when possible.</p>
        <p>— Gaadi Notify</p>
      `,
    });
    console.log(`Email sent to ${ownerEmail}`);
  } catch (err) {
    console.error("Email sending failed:", err.message);
  }
};