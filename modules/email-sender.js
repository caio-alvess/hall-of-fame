const nodemailer = require('nodemailer');
require('dotenv').config();

const user = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

function sendMail(userEmail, authCode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    })
    const htmlMessage =
        `<h1>Olá!</h1>\n<p>Falta pouco para você entrar no <b>Hall of Fame</b>!
        <br>Seu código de verificação é <h2>${authCode}</h2></p>`

    return transporter.sendMail({
        from: user,
        to: userEmail,
        subject: "Sua autenticação no Hall of Fame",
        html: htmlMessage
    });
}

module.exports = sendMail;