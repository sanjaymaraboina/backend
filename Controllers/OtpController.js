
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sanjaymaraboina@gmail.com',
    pass: 'onkm zzep roln acyj',
  },
});

const sendOtp = async (email, req) => {
  if (!email) {
    return null;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const mailOptions = {
    from: 'ravikumarmenthula@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    const currentTime = new Date();
    const otpData = { otp, currentTime };
    req.app.locals.otpData = otpData;

    return otpData;
  } catch (error) {
    console.error('Failed to send OTP', error);
    return null;
  }
};

module.exports = { sendOtp };
