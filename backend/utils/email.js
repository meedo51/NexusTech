const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass'
  }
});

exports.sendEmail = async ({ email, subject, text, html }) => {
  const mailOptions = {
    from: `"NexusTech" <${process.env.SMTP_FROM || 'noreply@nexustech.dev'}>`,
    to: email,
    subject,
    text,
    html
  };

  await transporter.sendMail(mailOptions);
};
