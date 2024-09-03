const express = require('express');
const {createJob,getJobs, getJob, deleteById, updateById, getJobsEmployer,getJobstoApply, getAppliedJobs} = require("../Controllers/JobsController")
const {applyJob}  = require("../Controllers/applyController")
const {EmployerAuthMiddleware}  = require("../Controllers/employerController")
const {EmployeeAuthMiddleware} = require("../Controllers/employeeController")
const router = express.Router();



router.post("/createjob", EmployerAuthMiddleware , createJob);

router.get('/getjobs',EmployeeAuthMiddleware,getJobs );

router.get('/getjobsemployer', EmployerAuthMiddleware,getJobsEmployer )

router.get("/getjobs/:id",EmployeeAuthMiddleware, EmployerAuthMiddleware, getJob) ;

router.delete("/deletejob/:id", EmployerAuthMiddleware,deleteById  )

router.put("/updateJob/:id",EmployerAuthMiddleware, updateById );

router.post("/apply/:id", EmployeeAuthMiddleware, applyJob ) ;

router.get("/getappliedjobs", EmployeeAuthMiddleware , getAppliedJobs )
router.get("/getjobstoapply",EmployeeAuthMiddleware,getJobstoApply )



module.exports = router