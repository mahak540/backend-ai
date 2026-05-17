const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ✅ Generate secure 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// ✅ Configure Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,       // ✅ clear name
    pass: process.env.BREVO_SMPT_KEY// ✅ clear name
  }
});

// ✅ Send OTP Email
const sendEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"mywebsite" <paragat00@gmail.com>`, // ✅ must match Brevo sender
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color:#ff4d4d;">YumOnTheWay - OTP Verification</h2>

          <p>Your OTP code is:</p>

          <div style="background:#f4f4f4; padding:20px; text-align:center; margin:20px 0;">
            <h1 style="letter-spacing:6px; color:#ff4d4d; margin:0;">
              ${otp}
            </h1>
          </div>

          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    console.log("✅ Email sent:", info.messageId);
    return true;

  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    return false;
  }
};

module.exports = { generateOTP, sendEmail };
