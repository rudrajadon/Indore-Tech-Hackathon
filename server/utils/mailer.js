const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: `"Indore Smart City" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code for Indore Smart City Portal',
    text: `Your OTP code is: ${otp}\n\nThis code will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${to}:`, error);
    throw new Error('Failed to send OTP email');
  }
}

module.exports = { sendOTPEmail };