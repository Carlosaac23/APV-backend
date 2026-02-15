import nodemailer from 'nodemailer';

export async function registerEmail(data) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { name, email, token } = data;

  const info = await transporter.sendMail({
    from: 'APV',
    to: email,
    subject: 'Confirm your account',
    text: 'Confirm your account',
    html: `<p>Hi ${name}, confirm your account in APV.</p>
      <p>Your account is ready, just have to confirm it in the following link:</p>
      <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm your account</a>
      <p>If you didn't create the account, ignore this message.</p>
      `,
  });

  console.log('Mensaje enviado: %s', info.messageId);
}
