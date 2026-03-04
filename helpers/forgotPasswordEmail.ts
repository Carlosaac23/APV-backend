import type { VeterinarianEmail } from '../schemas/veterinarianSchema.js';
import nodemailer from 'nodemailer';
import type { Options } from 'nodemailer/lib/smtp-transport/index.js';
export async function forgotPasswordEmail(data: VeterinarianEmail) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as Options);

  const { name, email, token } = data;

  const info = await transporter.sendMail({
    from: 'APV',
    to: email,
    subject: 'Reset your password',
    text: 'Reset your password',
    html: `<p>Hi ${name}, you've requested reset your password.</p>
      <p>Follow next link to reset your password:</p>
      <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset your password</a>
      <p>If you didn't create the account, ignore this message.</p>
      `,
  });

  console.log('Mensaje enviado: %s', info.messageId);
}
