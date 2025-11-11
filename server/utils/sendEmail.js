require("dotenv").config(); //have access to environment variable
const nodemailer = require("nodemailer");
const { AUTH_EMAIL, AUTH_PASS } = process.env;
// const AUTH_EMAIL = "polarpetrochemicals@gmail.com";
// const AUTH_PASS = "kimjcjvzufsmjnxa";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
});

//test transporter

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log("Success");
  }
});

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = sendEmail;