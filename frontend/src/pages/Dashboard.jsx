import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const API_URL = '/api/auth/get-trips';


export const Dashboard = ({ user }) => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleCreateTripClick = () => {
        navigate('/trip-planner');
    }

    useEffect(() => {
        const fetchTrips = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(API_URL, {
                    withCredentials: true
                });
                console.log("got the response");

                setTrips(response.data);

            } catch (err) {
                console.error("API Error fetching trips:", err);

                let errorMessage = "Failed to fetch trips. Check server status.";

                if (err.response) {
                    if (err.response.status === 401) {
                        errorMessage = "Authentication failed. Please log in.";
                    } else {
                        errorMessage = `Server responded with status ${err.response.status}.`;
                    }
                }
                else if (err.message === 'Network Error' || !err.response) {
                    errorMessage = 'Cannot connect to the backend server. Is the server running and is CORS configured?';
                }

                setError(errorMessage);
                console.log("getting error please check....");

            } finally {
                setIsLoading(false);
            }
        };
        fetchTrips();
    }, []);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-blue-600">Loading trips...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="max-w-7xl mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <h2 className="text-2xl font-bold mb-3">Error Loading Data</h2>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">Please try logging in again or check your network connection.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col align-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
            <Toaster />

            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-500 pb-2">
                    My Trip Dashboard
                </h1>

                {trips.length === 0 ? (
                    <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Trips Found</h2>
                        <p className="text-gray-500">It looks like you haven't planned any trips yet. Start planning a new adventure!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map(trip => (
                            <div key={trip.trip_id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-blue-400">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{trip.trip_name}</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    {trip.source} to {trip.destination}
                                </p>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-700"><strong>Start:</strong> {new Date(trip.start_date).toLocaleDateString()}</p>
                                    <p className="text-gray-700"><strong>End:</strong> {new Date(trip.end_date).toLocaleDateString()}</p>
                                    <p className="text-gray-700"><strong>Cost:</strong> ${parseFloat(trip.estimated_cost).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <button onClick={handleCreateTripClick} className='m-auto w-[300px] mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-md 
                       shadow-lg hover:bg-blue-700 transition duration-300 transform 
                       hover:scale-105 cursor-pointer'> + Plan new Trips</button>
        </div>
    );
}

export default Dashboard;