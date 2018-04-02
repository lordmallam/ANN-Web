import nodemailer from 'nodemailer';
import config from '../config/environment';

const transporter = nodemailer.createTransport({
  host: config.SMTP.host,
  port: config.SMTP.port,
  secure: false,
  auth: {
    user: config.SMTP.username,
    pass: config.SMTP.password
  }
});

const generateID = (prefix, number) => {
  let processedNumber = number.toString();
  if(processedNumber.length < 5) {
    const paddedzero = '0'.repeat(5 - processedNumber.length);
    processedNumber = `${paddedzero}${processedNumber}`;
  }
  return `${prefix}${processedNumber}`;
};

const generateMemberID = (reverse = false, length = 8) => {
  let num = ''
  let alp = ''
  const min = Math.ceil(0);
  const max = Math.floor(9);
  for (var i = 0; i < length; i++) {
    num += Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  do {
    for (var i = 0; i < 3; i++)
      alp += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  while (alp === 'ANN')

  if (reverse)
    return `${alp}${num}`
  else
    return `${num}${alp}`
};

const generatePernamentMemberID = (length = 8) => {
  let num = ''
  let alp = 'ANN'
  const min = Math.ceil(0);
  const max = Math.floor(9);
  for (var i = 0; i < length; i++) {
    num += Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  return `${alp}${num}`
};

const createRandomString = length => {
  let str = '';
  for (; str.length < length; str += Math.random().toString(36).substr(2));
  return str.substr(0, length);
};

const sendActivationMail = (email, name, ac, isMobile) => {
  let url = `${config.clientURL}confirmation/${ac}`;
  if (isMobile) {
    url = `${config.clientURL}confirmation/${ac}/xyz/mobile`
  }
  const HTMLmail = activationMail.replace('[MEMBER_NAME]', name).replace('[AC_URL]', url);
  let mailOptions = {
    from: config.SMTP.username,
    to: email,
    subject: 'ANN Registration Confirmation',
    html: HTMLmail
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

const sendMemberMail = (email, name, ac) => {
  const url = `${config.clientURL}`;
  const HTMLmail = memberMail.replace('[MEMBER_NAME]', name).replace('[AC_URL]', url);
  let mailOptions = {
    from: config.SMTP.username,
    to: email,
    subject: 'ANN Registration Confirmation',
    html: HTMLmail
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

const isEmpty = value => (value === undefined || value === '' || value === ' ' || value === '  ');

const activationMail = `<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
</head>
<body>
    <form id="form1">
        <div style="text-align: center; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
            <h3>Alliance for New Nigeria (ANN)</h3>
            <h4>Membership Registration</h4>
            <br /> 
            Hi [MEMBER_NAME],
            <br />
            Thank you for registering as a member of Alliance for New Nigeria (ANN). Please follow the link below to confirm your email adrress and complete your registartion process.<br />
            <br />
            <br />
            <br />
            <a style="background-color:#2a90bd; color: #fff; padding: 10px 30px; margin: 20px 10px; text-decoration:none" href="[AC_URL]">Confirm Email</a>
            <br />
            <br />
            <p style="font-style:italic">For Enquiries and Support contact us on<br />
            <a href="mailto:support@alliancefornewnigeria.org">support@alliancefornewnigeria.org/</a><br /></p>
        </div>
    </form>
</body>
</html>`;


const memberMail = `<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
</head>
<body>
    <form id="form1">
        <div style="text-align: center; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
            <h3>Alliance for New Nigeria (ANN)</h3>
            <h4>Membership Registration</h4>
            <br /> 
            Hi [MEMBER_NAME],
            <br />
            Thank you for registering as a member of Alliance for New Nigeria (ANN).
            You can get the lastest new and notifications on our website and mobile app.<br />
            <br />
            <br />
            <br />
            <a style="background-color:#2a90bd; color: #fff; padding: 10px 30px; margin: 20px 10px; text-decoration:none" href="[AC_URL]">Visit Us Today!!</a>
            <br />
            <br />
            <p style="font-style:italic">For Enquiries and Support contact us on<br />
            <a href="mailto:support@alliancefornewnigeria.org">support@alliancefornewnigeria.org/</a><br /></p>
        </div>
    </form>
</body>
</html>`;

export {
  generateID,
  createRandomString,
  sendActivationMail,
  isEmpty,
  sendMemberMail,
  generateMemberID,
  generatePernamentMemberID
};
