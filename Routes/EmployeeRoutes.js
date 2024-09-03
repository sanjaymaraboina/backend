const express = require('express');
// const { register, login  , getPersonalDetaills , updatePersonalDetails , authEmployeeMiddleware } = require('../Controllers/employeeControllers');
const {register, login} = require("../Controllers/employeeController")
// const {getApplication}  = require("../Controllers/applyController")

const router = express.Router();

router.post('/register', register);
router.post('/login',login)

// router.post('/login', login);

// router.get('/personaldetails', authEmployeeMiddleware,  getPersonalDetaills )
// router.put('/personaldetails/:id',authEmployeeMiddleware,  updatePersonalDetails )

// router.get('/applications',authEmployeeMiddleware,  getApplication);

module.exports = router;
