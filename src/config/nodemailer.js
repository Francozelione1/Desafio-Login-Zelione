import nodemailer from "nodemailer";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

 // Crear un transportador usando SMTP
const transporter = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'proyectoBackend796@gmail.com',
            pass: "ktwf mijp dbeh ghdj"
        }
    }
)

export const sendEmailDeleteAccount = async (email) => {
    // Configurar las opciones del correo
    const mailOptions = {
        from: 'proyectoBackend796@gmail.com', // Correo del remitente
        to: email, // Correo del destinatario, que se pasa como argumento a la función
        subject: 'Asunto del correo', // Asunto del correo
        text: 'Contenido del correo' // Contenido del correo
    }
    // Enviar el correo
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error.message);
    }
}

export const sendEmailPurchase = async (email, subject, text) => {

    const mailOptions = {
        from: 'proyectoBackend796@gmail.com',
        to: email,
        subject: subject,
        text: text
    }

    try{
        await transporter.sendMail(mailOptions)
    }
    catch(error){
        console.log(error.message)
    }
}