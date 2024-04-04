const express = require("express");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
var app = express();
app.use(cors()); // Allows incoming requests from any IP
// Generated with CLI

// Start by creating some disk storage options:
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  // Sets file(s) to be saved in uploads folder in same directory
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
  // Sets saved filename(s) to be original filename(s)
});

// Set saved storage options:
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "website.engineeringmaterials@gmail.com",
    pass: "hxuzxelabqoetegg",
  },
});


function generateRandomAlphaNumeric(length) {
  const charset = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

// Function to generate unique application ID
function generateApplicationID() {
  const prefix = 'AU';
  const randomChars = generateRandomAlphaNumeric(8); // Generate 8 random characters
  return prefix + randomChars;
}

app.post("/api", upload.array("files"), (req, res) => {
  // Sets multer to intercept files named "files" on uploaded form data
  SenderMailId = req.body.EmailId;
  let data = {ApplicationID:generateApplicationID(),}
//   console.log(req.body);
for (const [key, value] of Object.entries(req.body)) {
    data[key]=value;
  }
data['ReceiptPath'] = req.files[0].originalname;
  const options = {
    method: 'POST',
    headers: {Authorization: 'Bearer xau_ucuJHLz9N54FKlJIPlV1eGuaSXrJYPWC0', 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  };
  
  fetch('https://shannuboda-s-workspace-s7j279.us-east-1.xata.sh/db/augusta:main/tables/admission/data?columns=id', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));


    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
      <style>
        /* Add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src='https://augustaaviations.netlify.app/assets/logo-COdVf4q9.png' />
        <h1>Hello, ${data['FirstName']} ${data['LastName']}!</h1>
        <h1 style='color:red'>Welcome To Augusta Aviations!!!!!</h1>
        <h2>Application ID: ${data['ApplicationID']}</h2>
        <h4>Your Admission Form is Successfully Submitted <br> Our Person Will Contact You Soon once your Payment Status Approved</h4>
        <h5>You can check Your Payment Status under Payment Status tab by entering <b>Application Id and necessary details </b>on <a href="https://augustaaviations.netlify.app">https://augustaaviations.netlify.app</a></h5>
        <p>ThankYou For Choosing Augusta Aviations <br> Regards,<br>Augusta Aviations <br> Contact Support:<b>+91 9390513054</b> <br> Email Id: agastaaviation1@gmail.com</p>
      </div>
    </body>
    </html>
  `;
  
    const mailOptions = {
      from: "website.enginneringmaterials@gmail.com",
      to: SenderMailId, // Change to recipient email
      subject: "Augusta Aviations Admission Request IMP",
      html: emailTemplate,
      attachments: req.files.map((file) => ({
        filename: file.originalname,
        path: file.path,
      })),
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Form submitted successfully and email sent" });
      }
    });



console.log(data);
  console.log(req.files[0].originalname); // Logs any files
  res.json({ message: "File(s) uploaded successfully" });
});


app.listen(5000, function () {
  console.log("Server running on port 5000");
});
