const { Sequelize } = require("sequelize");

const mysql = require("mysql");






const pool = mysql.createPool({
    host: "localhost", // MySQL server host
    user: "root", // MySQL username
    password: "", // MySQL password
    database: "careerbridge", // MySQL database name
  });
  
  
  const sqlConnection = () => {
    try {
        let connection;
      if (connection) {
        return connection;
      }
     return connection = new Sequelize("careerbridge", "root", "", {
        dialect: "mysql",
        host: "localhost",
        port: 3306,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          
          idle: 10000,
        },
        dialectOptions: {
          connectTimeout: 60000,
        },
        logging: false,
      });
    } catch (error) {
      throw error;
    }
  };
  
  async function executeQuery(
    query,
    type,
    replacements = {},
    transaction = null
  ) {

    try {
      const connection =  sqlConnection();
      const result = await connection.query(query, { replacements, type });
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = { pool, executeQuery };
  