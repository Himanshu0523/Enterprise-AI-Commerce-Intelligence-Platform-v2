const nodemailer = require('nodemailer');

let transporter;
let transporterConfigKey;

function getTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error('SMTP is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS on auth-service.');
  }

  const configKey = [EMAIL_HOST, EMAIL_PORT, EMAIL_USER].join('|');
  if (!transporter || transporterConfigKey !== configKey) {
    const port = Number(EMAIL_PORT);
    if (!Number.isInteger(port) || port <= 0) throw new Error('EMAIL_PORT must be a valid TCP port.');
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port,
      secure: port === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    transporterConfigKey = configKey;
  }
  return transporter;
}

exports.verifySmtp = async () => getTransporter().verify();

exports.sendResetEmail = async (email, resetUrl) => {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from) throw new Error('EMAIL_FROM or EMAIL_USER must be configured.');
  return getTransporter().sendMail({
    from,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Open this link to reset your password: ${resetUrl}. This link expires in 1 hour.`,
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
};
