import { transporter } from "../config/mailer.js";

export const sendContactMail = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Recipient email missing",
      });
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("Mail error:", error);

    res.status(500).json({
      success: false,
      message: "Email failed to send",
    });
  }
};