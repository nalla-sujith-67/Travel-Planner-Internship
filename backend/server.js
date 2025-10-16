import express from 'express';
import ddotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoutes from './routes/auth.js'

const PORT = process.env.PORT || 3000; //if the port is defined inside the env file it will take it else
//it will get from this hardcoded value in this file.


ddotenv.config();



const app = express();

//without cors two domains cannot communticate to each other i.e the front end is running on port 5173 and the backend is 
// running on the port 3000 since these ports are different they cannot communicate so we use cors to enable the communication 
// between them (the frontend and the backend).

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, //through this we can pass the login/user info/the cookies from the server the client and vice - versa so that 
    //the user can be logged in accross the website/pages.
}));


//processing the requests using these middlewares before they reach the main/route handlers
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes)

//making the server to listen on the port number that i have taken above.
app.listen(PORT, () => {
    console.log("hey the port is listening on the port : " + PORT);
})