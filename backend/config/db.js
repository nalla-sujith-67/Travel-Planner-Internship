import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config(); //this is just to load the env contents from the env file i have written

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

//if the pool connection is successful then we will show a success message using the following

//using on event listener and showing the message if the connection is successful
pool.on("connect", () => {
    console.log('successfully connected to the database!!!');
})

//using the on event listener to indicate the unsuccessful connection of the database.

pool.on("error", () => {
    console.log("caught an Unexpected error while connecting yop the database : " + err);

})

export default pool;  //this is to export the pool that we have created and use it in the other files