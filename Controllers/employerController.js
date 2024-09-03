const bcrypt = require('bcryptjs');
const { QueryTypes } = require('sequelize');
const { sendOtp } = require('../Controllers/OtpController');
const { executeQuery } = require('../DB/db');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { response } = require('express');
exports.register = async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Insert new employer into the database
    const query = `INSERT INTO employer (companyname, email, mobile, companytype, password, address  ) VALUES ( :companyname, :email, :mobile, :companytype, :password, :address)`;

    const SECRETKEY = process.env.EMPLOYER_SECRET_KEY ;


    await executeQuery(query, QueryTypes.INSERT, {
      companyname : req.body.companyname,
      email : req.body.email,
      mobile : req.body.mobile,
      companytype : req.body.companytype,
    
      password: hashedPassword,
      address : req.body.address
     
     });

    // Send OTP to the employer's email
    const otpData = await sendOtp(req.body.email, req);

    if (otpData) {
      console.log('OTP Data:', otpData);
      res.status(201).send("Employer Registered and OTP sent");
    } else {
      res.status(500).send("Failed to send OTP");
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};


exports.login = async (req, res) => {
    try {
        const employerData = req.body;

        // Fetch the hashed password from the database
        const result = await executeQuery(
            `SELECT password,id FROM employer WHERE email = :email`,
            QueryTypes.SELECT,
            {
                email: employerData.email 
            }
        );
        console.log(result)
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        

        const hashedPassword = result[0].password;

        // Compare the password provided by the user with the hashed password
        const isMatch = await bcrypt.compare(employerData.password, hashedPassword);

        if (isMatch) {

            const token = jwt.sign({ email: employerData.email }, process.env.EMPLOYER_SECRET_KEY, { expiresIn: '1h' });
            
            
            res.status(200).json({id : result[0].id,"email" : employerData.email, "token" : token});
        } else {
            res.status(401).send("Incorrect password");
        }

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).send("An error occurred");
    }
};





exports.EmployerAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.EMPLOYER_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid token' });
    }
  };














