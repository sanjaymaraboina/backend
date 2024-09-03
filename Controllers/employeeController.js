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
    
    // Insert new employee into the database
    const query = `INSERT INTO employee (fullname, email, mobile, password,currentcompany,companytype,currenttechnologies,currentexperience,address,language,noticeperiod  ) VALUES (:fullname, :email, :mobile, :password,:currentcompany,:companytype,:currenttechnologies,:currentexperience,:address,:language,:noticeperiod)`;

    const SECRETKEY = process.env.EMPLOYEE_SECRET_KEY ;


    await executeQuery(query, QueryTypes.INSERT, {
      fullname: req.body.fullname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword,
      currentcompany : req.body.currentcompany,
      companytype : req.body.companytype,
      currenttechnologies : req.body.currenttechnologies,
      currentexperience : req.body.currentexperience,
      address : req.body.address,
      language : req.body.language,
      noticeperiod : req.body.noticeperiod
     });

    // Send OTP to the employee's email
    const otpData = await sendOtp(req.body.email, req);

    if (otpData) {
      console.log('OTP Data:', otpData);
      res.status(201).send("Employee Registered and OTP sent");
    } else {
      res.status(500).send("Failed to send OTP");
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};


exports.login = async (req, res) => {
    try {
        const employeeData = req.body;

        // Fetch the hashed password from the database
        const result = await executeQuery(
            `SELECT id,password FROM employee WHERE email = :email`,
            QueryTypes.SELECT,
            {
                email: employeeData.email  // Corrected the typo here
            }
        );
        console.log(result)
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        

        const hashedPassword = result[0].password;

        // Compare the password provided by the user with the hashed password
        const isMatch = await bcrypt.compare(employeeData.password, hashedPassword);

        if (isMatch) {

            const token = jwt.sign({ email: employeeData.email }, process.env.EMPLOYEE_SECRET_KEY, { expiresIn: '1h' });
            
            
            res.status(200).json({"id" : result[0].id,"email" : employeeData.email, "token" : token});
        } else {
            res.status(401).send("Incorrect password");
        }

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).send("An error occurred");
    }
};





exports.EmployeeAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.EMPLOYEE_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid token' });
    }
  };














