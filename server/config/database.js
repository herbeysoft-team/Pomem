
require('dotenv').config();
const mysql = require('mysql2-async').default;

//conection to database
const db = new mysql({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  timezone:"Z"

})

if(db){
  console.log("database connection successful");
} else{
  console.log("database connection not successful");
}


module.exports = db