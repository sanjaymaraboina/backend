const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const EmployeeRoutes = require("./Routes/EmployeeRoutes")
const EmployerRoutes = require("./Routes/EmployerRoutes")
const JobRoutes = require("./Routes/JobRoutes")
const app = express();
app.use(express.json());
app.use(cors());




app.use("/api/employee",EmployeeRoutes)
app.use("/api/employer",EmployerRoutes)

app.use("/api/employee/jobs", JobRoutes );

app.use("/api/employer/jobs", JobRoutes );







app.post('/verify-otp', async (req, res) => {
    const { otpData } = req.app.locals;
    const { otp } = req.body;
    console.log(otpData)
    if (!otpData) {
        return res.status(400).send("No OTP data found");
    }

    const currentTime = new Date().getTime();
    const otpTime = new Date(otpData.currentTime).getTime();
    const timeDiff = currentTime - otpTime; // Difference in milliseconds
    
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

    if (timeDiff <= tenMinutesInMs) {
        if (otp === otpData.otp) {
            res.status(200).send("Email Verified");
        } else {
            res.status(400).send("Incorrect OTP");
        }
    } else {
        res.status(400).send("OTP Expired");
    }
});

const mysqlHome = process.env.MYSQL_HOME; // Example if such a variable exists
console.log('MySQL Home:', mysqlHome);
const mysqlPath = process.env.Path.split(';').find(path => path.includes('MySQL'));
console.log('MySQL Path:', mysqlPath);




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



