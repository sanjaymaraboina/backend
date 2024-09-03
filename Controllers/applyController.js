const { QueryTypes } = require('sequelize');
const { executeQuery } = require('../DB/db');



exports.applyJob = async (req, res) => {
    try {
      const applyData = req.body;
      const jobid = req.params.id;
  
      // Check if the jobid exists in the jobs table
      const jobExistsQuery = `SELECT id FROM jobs WHERE id = :jobid`;
      const jobExists = await executeQuery(jobExistsQuery, QueryTypes.SELECT, { jobid });
  
      if (jobExists.length === 0) {
        return res.status(400).send("Job not found");
      }
  
      // If job exists, insert into applyjobs table
      const query = `INSERT INTO applyjobs (jobid, empid, isapply) VALUES(:jobid, :empid, :isapply)`;
      await executeQuery(query, QueryTypes.INSERT, {
        jobid: jobid,
        empid: applyData.empid,
        isapply: applyData.isapply
      });
  
      res.status(201).send("Applied Successfully");
    } catch (error) {
      res.status(500).send(`Error While Applying Job: ${error}`);
    }
  };
  