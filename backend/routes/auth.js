//in this folder we will define all the routs
import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';  //importing the database configuration file
import protect from "../middleware/auth.js";

const router = express.Router();

const cookieOptions = {
    httpOnly: true,  //to prevent javascript code in the browser to change or manipulate the tokens
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, //this says that the cookie should be active till 30 days.
}

//we will add the user id to the cookie payload to identify them later 
const generateToken = (id) => {  //this (the id) is the only piece of user data that we embed into the cookie information / payload
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}


//creating a register endpoint

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'please enter all the required fields' });
    }

    //checking whether the user exists in the database or not
    const userExistanceQuery = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(userExistanceQuery, [email]);

    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'the user already exists!' })
    }

    //if the user doesnot exist then we will hash the password with the help of bcrypt

    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new user and saving the data in the database;

    const addTheUser = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
    const newUser = await pool.query(addTheUser, [name, email, hashedPassword]); //commiting the user to the database

    const token = generateToken(newUser.rows[0].id);
    res.cookie('token', token, cookieOptions); //storing the new cookie with the following options and token.

    return res.status(201).json({ user: newUser.rows[0] }); ///after creating and signing the tokens we will return success code
    //along with these user details.
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('please fill all the fields');
    }

    const getUserQuery = 'SELECT * FROM users WHERE email = $1';
    const user = await pool.query(getUserQuery, [email]);

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userData = user.rows[0];
    const isMatch = await bcrypt.compare(password, userData.password);   //compares the given and already existing password.

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(userData.id);
    res.cookie('token', token, cookieOptions);


    res.json({ user: { id: userData.id, username: userData.name, email: userData.email } });
})



//route to get the logged in users information

router.get('/me', protect, async (req, res) => {
    res.json(req.user);
    //return the info of the logged in user from the protect middleware that we will create later.
})


//logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
    res.json({ message: 'logged out successfully!!' });
})

//this is to add the new trips from the form in the frontend page to the trips table in my database.
router.post('/trips', protect, async (req, res) => {
    try {
        const user_id = req.user.id;

        const {
            tripName,
            source,
            destination,
            startDate,
            endDate,
            estimatedCost
        } = req.body;

        if (!tripName || !source || !destination || !startDate || !endDate || !estimatedCost) {
            return res.status(400).json({ message: 'Please provide all trip details.' });
        }

        // 4. SQL Query to insert the new trip
        const insertQuery = `
            INSERT INTO trips (
                user_id, trip_name, source, destination, 
                start_date, end_date, estimated_cost
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            user_id,
            tripName,
            source,
            destination,
            startDate,
            endDate,
            estimatedCost
        ];


        const result = await pool.query(insertQuery, values);

        res.status(201).json({
            message: "Trip created successfully!",
            trip: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating trip:", error.message);
        // This catch handles database errors (e.g., if a date format is wrong)
        res.status(500).json({ error: "Server error: Could not save trip." });
    }
});


//this route is to get the user details
router.get('/get-trips', protect, async (req, res) => {

    // The user_id is retrieved from the request after the authentication middleware runs.
    const userId = req.user.id;

    const query = `
        SELECT trip_id, user_id, trip_name, source, destination, 
        start_date, end_date, estimated_cost, created_at FROM trips WHERE user_id = $1 ORDER BY start_date DESC;
    `;

    try {
        const result = await pool.query(query, [userId]);
        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Database query error in /auth/trips:", error);
        res.status(500).json({ message: "Internal server error during data retrieval." });
    }
});


export default router;