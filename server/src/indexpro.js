const express = require ("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
const collection = require('./mongodbpro')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

// Config
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Enable CORS for React frontend
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

function generateVerificationToken() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
}


app.use(express.json())
app.use(express.urlencoded({extended:false}))


// React frontend routes - serve static files
app.get("/", (req, resp) => {
    resp.json({ message: "Backend API is running. Use React frontend for UI." });
});

app.get("/signup", (req, resp) => {
    resp.json({ message: "Backend API is running. Use React frontend for UI." });
});

// API Routes for React frontend
app.post("/api/signup", async (req, resp) => {
  const plaintextPassword = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
    const otp= generateVerificationToken();

    const data = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      Mobile: req.body.Mobile,
      otp: otp,
      isVerified: false,
    };

    await collection.insertMany([data]);

    // Send the verification email
    sendVerificationEmail(data.email, otp);
     
    resp.json({ success: true, message: "Account created. Please check your email for OTP." });
    
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

     
  const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function sendVerificationEmail(email, otp) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    html: `
  <p>Your OTP for email verification is:</p>
  <p><strong>${otp}</strong></p>
`,

  };
  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email: ' + error);
    } else {
      console.log('Email sent: ' + info.messageId);
    }
  });
}


app.post("/api/verify-otp", async (req, resp) => {
  const enteredOTP = req.body.otp;

  try {
    const user= await collection.findOne({ otp:enteredOTP });
    if (user) {
      if (user.isVerified) {
        resp.json({ success: false, message: "Email is already verified" });
      } else {
        if (user.otp === req.body.otp) {
          await collection.updateOne(
            { _id: user._id },
            {
              $set: {
                isVerified: true,
                otp:null
              },
            }
          );
          resp.json({ success: true, message: "Email and OTP have been successfully verified." });
        } else {
          resp.json({ success: false, message: "Invalid OTP" });
        }
      }
    } else {
      resp.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    resp.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

  
  
 
    

  

  app.post("/api/login", async (req, resp) => {
    try {
      const user = await collection.findOne({ email: req.body.email });
  
      if (user) {
        const isPasswordValid = await bcrypt.compare(
          req.body.password,
          user.password
        );

         
  
        if (isPasswordValid ) {
          if (user.isVerified) {
            // Password and OTP are valid, and email is verified, allow login
            resp.json({ success: true, message: "Login successful" });
          } else {
            // Password and OTP are valid, but email is not verified, reject login
            resp.json({ success: false, message: "Email is not verified. Please check your email for a verification link." });
          }
        } else {
          // Password or OTP is invalid, reject login
          resp.json({ success: false, message: "Wrong password" });
        }
      } else {
        resp.json({ success: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      resp.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

  

app.listen(5000,()=>{
    console.log("API listening on http://localhost:5000");
})