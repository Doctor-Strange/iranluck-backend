const nodemailer = require("nodemailer");
const Confirm_Code_Template = require("./Templates/conformEmail");

const Mailer = (to, subject, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtpout.asia.secureserver.net",
    secureConnection: true,
    port: 3535,
    auth: {
      user: "info@iranluck.com",
      pass: process.env.GO_DADDY_E_P
    }
  });

  const mailOptions = {
    from: "info@iranluck.com",
    to,
    subject,
    // text: `Your Confirm Code Is`
    html: `${Confirm_Code_Template(code)}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfuly");
    }
  });
};

module.exports = Mailer;
