// "use strict";
const nodemailer = require("nodemailer");

const sendEmail=async (from,subject,message,emailTo) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    });
    try{
        await transporter.sendMail({
            from: `"${from} 👻" <${process.env.EMAIL_USER}>`, 
            to: emailTo,
            subject: subject,
            // text: message, 
            html: message,
        });
    }catch(error){
        console.log(error.message);
    }
    
}

module.exports=sendEmail;