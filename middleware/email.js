const nodemailer = require("nodemailer");
const crypto = require("crypto");

const generateOTP = ()=>{
    return crypto.randomInt(100000,1000000).toString();
}
//SMTP = Simple Mail Transfer Protocol

const transporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port:2525,
    secure:false,
    auth:{
        user:process.env.BREVO_EMAIL,
        pass:process.env.BREVO_SMPT_KEY,
    }
    tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});
    
const sendEmail = async(email,otp)=>{
    try{
        const info = await transporter.sendMail({
            from:`"mywebsite" <mittalmehak121@gmail.com>`,
            to:email,
            subject:"Your OTP code is",
            html:`
            <h1> your otp is ${otp} </h1>
            `
        })
        return true;
    }catch(err){
        console.log(err);
        return false
    }
}
module.exports = {generateOTP, sendEmail};
