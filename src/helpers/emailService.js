// src/helpers/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração robusta do transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true para porta 465, false para 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Deve ser a Senha de App de 16 caracteres
    },
    // Opção de segurança para ambientes de desenvolvimento
    tls: {
        rejectUnauthorized: false,
    },
});

/**
 * Verifica se a conexão com o servidor de e-mail está funcionando.
 * Ótimo para usar na inicialização do servidor.
 */
async function verificarConexaoEmail() {
    try {
        await transporter.verify();
        console.log('✅ Conexão com o servidor de e-mail estabelecida com sucesso.');
    } catch (error) {
        console.error('❌ ERRO CRÍTICO AO CONECTAR COM O SERVIDOR DE E-MAIL:');
        console.error(error);
    }
}

async function enviarEmailOTP(destinatario, otp) {
    const mailOptions = {
        from: `"Banco Malvader" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: `Seu código de acesso: ${otp}`,
        text: `Olá! Seu código de acesso para o Banco Malvader é ${otp}.`,
        html: `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #444; font-size: 24px; margin: 0;">Banco Malvader</h1>
        </div>
        <h2 style="color: #555; font-size: 20px;">Seu Código de Acesso Único</h2>
        <p>Olá,</p>
        <p>Use o código abaixo para concluir sua autenticação. Este código é válido por 5 minutos.</p>
        <div style="text-align: center; margin: 30px 0;">
            <p style="background-color: #eee; font-size: 36px; font-weight: bold; letter-spacing: 5px; padding: 15px 20px; border-radius: 8px; display: inline-block;">
                ${otp}
            </p>
        </div>
        <p>Se você não solicitou este código, por favor, ignore este e-mail e entre em contato com nosso suporte.</p>
        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
            <p>&copy; 2025 Banco Malvader. Todos os direitos reservados.</p>
        </div>
    </div>
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
    verificarConexaoEmail,
};
