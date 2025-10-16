import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import heroImage from '../assets/heroImage.jpg'
const heroImage = "https://images.pexels.com/photos/2138922/pexels-photo-2138922.jpeg";

const Home = ({ user, error }) => {
    const navigate = useNavigate();

    //function i have written to handle the explore button.
    const handleExploreClick = () => {
        navigate('/dashboard');
    }

    //function i have written to handle the plan a trip button.

    const handleCreateTripClick = () => {
        navigate('/trip-planner');
    }

    return (

        <div>
            <div className='relative w-full h-[800px] shadow-2xl overflow-hidden flex items-center justify-center text-center bg-cover bg-center' style={{ backgroundImage: `url("${heroImage}")` }}>
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative p-6 max-w-5xl">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight 
                         drop-shadow-lg tracking-wider">
                        Welcome to PlanMyTrip
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-100 font-light italic 
                        drop-shadow-md mb-10">
                        ----your trip planning partner----
                    </p>

                    <p className="text-xl md:text-3xl text-gray-100 font-light italic 
                        drop-shadow-md mb-8">
                        "The journey of a thousand miles begins with a single step."
                    </p>

                    {error && <p className="text-red-500">{error}</p>}
                    {user ? <div className="flex flex-row gap-5 justify-center align-center">
                        <button onClick={handleExploreClick}
                            className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-md 
                       shadow-lg hover:bg-blue-700 transition duration-300 transform 
                       hover:scale-105"
                        > Explore Trips </button>

                        <button onClick={handleCreateTripClick} className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-md 
                       shadow-lg hover:bg-blue-700 transition duration-300 transform 
                       hover:scale-105"> Plan a new Trip</button>
                    </div> : <Link
                        to="/login" className="text-white bg-blue-500 px-10 py-4 rounded-md hover:bg-blue-600 font-medium">
                        Login
                    </Link>}
                </div>
            </div>
        </div>

    );
};

export default Home;