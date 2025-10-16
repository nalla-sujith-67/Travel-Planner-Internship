import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Defining the initial state for all form fields
const initialTripState = {
    tripName: '',
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    estimatedCost: '',
};

//just created a component like thing for each input for cleaner and modular code.
const FormField = ({ htmlFor, label, name, type, value, onChange, placeholder, min, step }) => (
    <div className="form-group w-full mb-4">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={htmlFor}
            name={name}
            required
            value={value}
            onChange={onChange}
            className="border p-2 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black transition duration-150 ease-in-out"
            placeholder={placeholder}
        />
    </div>
);


const TripPlanner = () => {

    //all the required and needed states
    const [tripData, setTripData] = useState(initialTripState);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = '/api/auth/trips';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTripData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                API_URL,
                tripData,
                {
                    withCredentials: true,
                }
            );

            const data = response.data;
            toast.success(data.message || 'Trip created successfully!', { position: 'top-center' });
            setTripData(initialTripState); // Clear the form on success
            navigate('/dashboard'); //and finally iam navigating the user to the dashboard page upon successfully creating a trip


        } catch (error) {
            console.error("API error:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 401) {
                toast.error('Session expired or not logged in. Please log in.', { position: 'top-center' });
                // navigate('/login'); 
            } else if (message) {
                toast.error(message, { position: 'top-center' });
            } else {
                toast.error('Could not connect to the server.', { position: 'top-center' });
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

            <Toaster />

            <form
                id="tripForm"
                onSubmit={handleSubmit}
                className='bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-lg 
                           flex flex-col items-center'
            >
                <h2 className="text-2xl mb-6 font-bold text-center text-blue-600">
                    Plan New Trip
                </h2>

                <FormField
                    htmlFor="tripName" label="Trip Name" name="tripName" type="text"
                    value={tripData.tripName} onChange={handleInputChange} placeholder="e.g., European Backpacking"
                />

                <FormField
                    htmlFor="source" label="Source" name="source" type="text"
                    value={tripData.source} onChange={handleInputChange} placeholder="e.g., New York, USA"
                />

                <FormField
                    htmlFor="destination" label="Destination" name="destination" type="text"
                    value={tripData.destination} onChange={handleInputChange} placeholder="e.g., Paris, France"
                />

                <div className="w-full flex gap-4 mb-4">
                    <div className="form-group w-1/2">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" id="startDate" name="startDate" required value={tripData.startDate} onChange={handleInputChange}
                            className="border p-2 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black transition duration-150 ease-in-out"
                        />
                    </div>

                    <div className="form-group w-1/2">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="date" id="endDate" name="endDate" required value={tripData.endDate} onChange={handleInputChange}
                            className="border p-2 w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black transition duration-150 ease-in-out"
                        />
                    </div>
                </div>

                <FormField
                    htmlFor="estimatedCost" label="Estimated Cost (INR)" name="estimatedCost" type="number"
                    min="0" step="0.01" value={tripData.estimatedCost} onChange={handleInputChange} placeholder="5000"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`mt-4 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out w-full ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                        }`}
                >
                    {isLoading ? 'Saving Trip...' : 'Create Trip'}
                </button>

            </form>
        </div>
    );
};


export default TripPlanner;