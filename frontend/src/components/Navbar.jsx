import React, { useState } from 'react'
import {useAuth} from '../authContext.jsx';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { isLoggedIn, setCurrentUser} = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userId");
        setCurrentUser(null);
    }
    
    const handleAbout = () =>{
        navigate('/about');
    }

    const handleUser = () =>{
        navigate('/guide');
    }
    
    const handleRegister = () =>{
        navigate('/auth');
    }
    const handleProfile = () =>{
        navigate('/profile');
    }
    const handleHome =()=>{
        navigate('/');
    }

    const handleNew = () =>{
        navigate('/create');
    }
    return (
<>
     {/* navbar */}
    <div className="navbar">
        <nav>
            <h2 className='h1-title' onClick={handleHome}>TrackIt</h2>
            <div className="menu">
                <ul className='list-menu'>
                    <li onClick={handleAbout}>About Us</li>
                    <li onClick={handleUser}>User Guide</li>
                    {isLoggedIn ?(
                        <>
                        <li onClick={handleProfile}>Profile</li>
                        <li onClick={handleNew}>New Repository</li>
                        <li onClick={handleLogout}>Logout</li>
                        </>
                    ):(
                        <>
                            <li onClick={handleRegister}>Sign In</li>
                            <li onClick={handleRegister}>Login</li>
                        </>
                    )}
                   
                </ul>
            </div>
        </nav>
    </div>
  </>
  )
}
