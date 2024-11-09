import nodemailer from 'nodemailer';
import configs from "../configs/configs.js";
//vamos a recibir el email donde vamos a enviar el correo
//vamos a recibir el asunto del correo electronico
//vamos a recibir el mensaje
//Options es un objeto que tiene las propiedades email,subjet,messaje
const sendEmail = async (options) => {
    //vamos a crear la integracion con el servicion mailtrap
    const transporter = nodemailer.createTransport(
        {
            host: "live.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: configs.MAILTRAP_USER,
                pass: configs.MAILTRAP_PASS,
            }
        })
    //vamos a armar las opciones de envio de nuestro correo
    const mailOptions ={
        from:'"kruger Backend" <no-reply@demomailtrap.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    await transporter.sendMail(mailOptions);
}

export default sendEmail;

