import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import axios from "axios";
import NotFound from './components/NotFound';
import TripPlanner from './pages/TripPlanner';
import { Dashboard } from './pages/Dashboard';

axios.defaults.withCredentials = true;



function App() {

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }


  return (
    <>
      <Router>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path='/' element={<Home user={user} error={error} />} />
          <Route path='/login' element={user ? <Navigate to='/' /> : <Login setUser={setUser} />} />
          <Route path='/register' element={user ? <Navigate to='/' /> : <Register setUser={setUser} />} />
          <Route path='/trip-planner' element={<TripPlanner />} />
          <Route path='/dashboard' element={<Dashboard user={user} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

      </Router>

    </>
  )
}

export default App
