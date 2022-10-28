require('dotenv').config(); // 환경변수

const sql = require("mssql");

const server    = process.env.BUSINESS_HOST;
const port      = process.env.BUSINESS_PORT;
const database  = process.env.BUSINESS_DB;
const userName  = process.env.BUSINESS_USERNAME;
const password  = process.env.BUSINESS_PASSWORD;

console.log(`${server}:${port}/${database}, ${userName}, ${password}`)
const config = {
    server
  , port          : parseInt(port)
  , options       : { encrypt:false, database, connectTimeout:15000 }
  , authentication: { type:"default", options:{ userName, password } }
}

const pool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => { console.log('Connected to MSSQL');return pool; })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    sql, pool
}