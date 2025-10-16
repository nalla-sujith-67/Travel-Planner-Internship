import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post("/api/auth/logout");
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="bg-black text-white">
            <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
                <Link to="/" className="font-bold text-xl">
                    PlanMyTrip
                </Link>

                <div className="flex flex-row gap-8 justify-between items-center">
                    <Link to="/dashboard" className="">
                        Mydashboard
                    </Link>
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-3 py-1 rounded cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="mx-2">
                                Login
                            </Link>
                            <Link to="/register" className="mx-2">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;