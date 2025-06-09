// src/helpers/emailService.js

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_PORT === '465', // true para a porta 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 *  Envia um e-mail formatado com o código OTP.
 * @param {string} destinatario - E-mail do usuário.
 * @param {string} otp - O código de 6 dígitos a ser enviado.
 */
async function enviarEmailOTP(destinatario, otp) {
  const mailOptions = {
    from: `"Banco Malvader" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: `Seu código de acesso: ${otp}`,
    text: `Olá! Seu código de acesso para o Banco Malvader é ${otp}. Este código expira em 5 minutos.`,
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">Banco Malvader</h2>
        <p>Olá!</p>
        <p>Seu código de acesso único é:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #000;">${otp}</p>
        <p style="color: #666;">Este código é válido por 5 minutos. Nunca o compartilhe com ninguém.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail com OTP enviado para ${destinatario}`);
    return true;
  } catch (error) {
    console.error(`Falha ao enviar e-mail com OTP para ${destinatario}:`, error);
    return false;
  }
}

module.exports = {
  enviarEmailOTP,
};