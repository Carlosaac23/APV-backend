import nodemailer from 'nodemailer';

export default async function emailForgotPassword(data) {
  const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;

  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const { name, email, token } = data;
  const { FRONTEND_URL } = process.env;

  const info = await transport.sendMail({
    from: 'APV - Administrador de Pacientes de Veterinaria',
    to: email,
    subject: 'Reestablece tu contraseña',
    text: 'Reestablece tu contraseña',
    html: `<p>Hola, ${name}. Has solicitado reestablecer tu contraseña.</p>
      <p>
        Sigue el siguiente enlace para reestablecer tu contraseña:
        <a href="${FRONTEND_URL}/forgot-password/${token}">Reestablecer Contraseña</a>
      </p>

      <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje.</p> `,
  });

  console.log('Mensaje enviado: %s', info.messageId);
}
