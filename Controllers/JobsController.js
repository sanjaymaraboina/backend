const { QueryTypes, json } = require('sequelize');
const { executeQuery } = require('../DB/db');





exports.createJob = async (req,res)=>{
    try {
        const jobDetails = req.body ;
        const query = `insert into jobs (jobcompanyname, jobrole , jobtechnologies, jobexperiencerequired, joblocation, jobgraduate, joblanguage, jobnoticeperiod, empid) values( :jobcompanyname, :jobrole , :jobtechnologies, :jobexperiencerequired, :joblocation, :jobgraduate, :joblanguage, :jobnoticeperiod, :empid)`
        await executeQuery(query , QueryTypes.INSERT, {
            jobcompanyname : jobDetails.jobcompanyname,
            jobrole : jobDetails.jobrole,
            jobtechnologies : jobDetails.jobtechnologies,
            jobexperiencerequired :jobDetails.jobexperiencerequired,
            joblocation : jobDetails.joblocation,
            jobgraduate : jobDetails.jobgraduate,
            joblanguage : jobDetails.joblanguage,
            jobnoticeperiod : jobDetails.jobnoticeperiod,
            empid : jobDetails.empid

        })
        res.status(201).send("Job Posted Successfully") ;

    } catch (error) {
        res.status(500).send(`Error ${error}`)
    }    
}



exports.getJobs  = async (req,res)=>{
    try {
        const query = `select * from careerbridge.jobs`;
        const jobsData =  await executeQuery(query, QueryTypes.SELECT, {});
        if(jobsData){
            res.status(200).json(jobsData);
            // console.log(jobsData)
        }
        else{
            res.status(500).send("Error While getting the data");
        }
    } catch (error) {
        res.status(500).send(`Error : ${error}`);

    }
}

exports.getJobsEmployer = async (req, res) => {
    try {
      const { empid } = req.query; // Corrected to extract empid from params
      console.log('hi');
      if (!empid) {
        return res.status(400).send("Employer ID is required.");
      }
  
      const query = `SELECT * FROM jobs WHERE empid = :empid`; // Assuming the jobs table has employer_id as a foreign key
      console.log(query);
      const jobsData = await executeQuery(query, QueryTypes.SELECT , {
         empid ,
      });
    //   console.log(jobsData);
  
      if (jobsData.length > 0) {
        res.status(200).json({ jobs: jobsData });
      } else {
        res.status(404).send("No jobs found for the given employer ID.");
      }
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  };
  

exports.getJob = async (req,res)=>{
    try {
        const id = req.params.id ;
        const query = `select * from jobs where id = :id` ;
        const job = await executeQuery(query, QueryTypes.SELECT, {
            id : id 
        })
        if(job){
            res.status(200).json(job);

        }
        else{
            res.status(500).send("Error While getting the data");

        }
        
    } catch (error) {
        res.status(500).send(`Error : ${error}`);

    }
}


exports.updateById = async (req,res)=>{
    try {
        
        const id = req.params.id ;
        const jobDetails = req.body ;
        const query = `update jobs set jobcompanyname = :jobcompanyname, jobrole  = :jobrole , jobtechnologies  = :jobtechnologies, jobexperiencerequired  = :jobexperiencerequired, joblocation  = :joblocation, jobgraduate = :jobgraduate, joblanguage = :joblanguage, jobnoticeperiod = :jobnoticeperiod  where id=:id` ;
        await executeQuery(query,QueryTypes.UPDATE, {
            id : id,
            jobcompanyname : jobDetails.jobcompanyname,
            jobrole : jobDetails.jobrole,
            jobtechnologies : jobDetails.jobtechnologies,
            jobexperiencerequired :jobDetails.jobexperiencerequired,
            joblocation : jobDetails.joblocation,
            jobgraduate : jobDetails.jobgraduate,
            joblanguage : jobDetails.joblanguage,
            jobnoticeperiod : jobDetails.jobnoticeperiod
        } )

        res.status(200).send("Data Updated Successfully!!!");

        
    } catch (error) {
        res.status(500).send(`Error : ${error}`);

        
    }
}



exports.deleteById = async (req,res)=>{
  try {

    const id = req.params.id ; 
    const query = `delete from jobs where id=:id`;
    await executeQuery(query, QueryTypes.DELETE, {
        id : id
    })

    res.status(200).send("Deleted Record Successfully!!!");


    
  } catch (error) {
    res.status(500).send(`Error : ${error}`);

  }

}


// exports.applyJob = async (req,res)=>{
//     try {
//         const data = req.body ;
//         const query = `insert into applyjobs (jobid,empid,isapply) values(:jobid,:empid,:isapply)`;
//         const response = executeQuery(query, QueryTypes.INSERT, {
//             jobid : data.jobid,
//             empid : data.empid,
//             isapply : data.isapply
//         })
//         res.status(200).send("Applied");

//     } catch (error) {
//         res.status(500).send(`Error : ${error}`);

//     }
// }





exports.getJobstoApply = async (req,res)=>{
   try {

     const query = ` select * from jobs  CROSS JOIN applyjobs where applyjobs.isapply = false ` ;
    const data = await executeQuery(query, QueryTypes.SELECT, {});
        console.log(data)
        res.status(200).send(json(data));
    
   } catch (error) {

        res.status(500).send(`Error : ${error}`);

   }

   
}


exports.getAppliedJobs = async (req, res) => {
    try {
        const { empid } = req.query;

        // SQL query to get applied jobs
        const query = `
            SELECT * 
            FROM jobs 
            LEFT JOIN applyjobs ON jobs.id = applyjobs.jobid 
            WHERE applyjobs.isapply = 'true' AND applyjobs.empid = :empid
        `;
        
        const data = await executeQuery(query, QueryTypes.SELECT, { empid });
        console.log(data);
        res.status(200).json(data); // Use res.json to send JSON response
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        res.status(500).json({ error: error.message }); // Return error message as JSON
    }
};





// exports.getJobstoApply = async (req, res) => {
//     try {
//         const { empid } = req.body;

//         // Validate empid
//         if (!empid || isNaN(empid)) {
//             return res.status(400).json({ error: "Invalid employeeId provided" });
//         }

//         const query = `
//             SELECT jobs.*
//             FROM jobs
//             LEFT JOIN applyjobs ON jobs.id = applyjobs.jobid AND applyjobs.empid = :empid
//             WHERE applyjobs.isapply IS NULL OR applyjobs.isapply = false
//         `;

//         // Execute the query using your custom executeQuery function
//         const jobs = await executeQuery(query, {
//             type: QueryTypes.SELECT,
//             replacements: { empid } // Pass the empid properly as a replacement
//         });

//         console.log(jobs);
//         return res.status(200).json({ jobs });
//     } catch (error) {
//         console.error("Error fetching jobs to apply:", error);
//         return res.status(500).json({ error: "An error occurred while fetching jobs." });
//     }
// };


