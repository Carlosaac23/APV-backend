import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

interface Data {
  name: string;
  email: string;
  token: string;
}

export default async function emailRegister(data: Data) {
  const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;

  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  } as SMTPTransport.Options);

  const { name, email, token } = data;
  const { FRONTEND_URL } = process.env;

  const info = await transport.sendMail({
    from: 'APV - Administrador de Pacientes de Veterinaria',
    to: email,
    subject: 'Confirma tu cuenta en APV',
    text: 'Confirma tu cuenta en APV',
    html: `<p>Hola, ${name}. Confirma tu cuenta en APV.</p>
      <p>
        Tu cuenta está lista, solo debes confirmar tu correo en el siguiente
        enlace: <a href="${FRONTEND_URL}/verify/${token}">Comprobar Cuenta</a>
      </p>

      <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p> `,
  });
}
