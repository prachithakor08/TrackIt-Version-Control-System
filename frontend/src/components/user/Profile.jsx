import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import Footer from '../Footer';
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const { setCurrentUser } = useAuth();

    const techQuotes = [
        "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
        "“First, solve the problem. Then, write the code.” – John Johnson",
        "“Programs must be written for people to read.” – Harold Abelson",
        "“Simplicity is the soul of efficiency.” – Austin Freeman",
        "“The best way to get a project done faster is to start sooner.” – Jim Highsmith"
    ];

    const randomQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];

    useEffect(() => {
        const fetchUserDetails = async () => {
            const userId = localStorage.getItem("userId");

            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
                    setUserDetails(response.data);
                } catch (err) {
                    console.error("Cannot fetch user details: ", err);
                }
            } else {
                navigate("/auth");
            }
        };
        fetchUserDetails();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);
        navigate("/auth");
    };

    if (!userDetails) {
        return (
            <>
                <Navbar />
                <div className="loading-profile">Loading profile...</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-page-wrapper">
                <div className="user-profile-card">
                    {/* <button onClick={handleLogout} className="logout-btn-profile">Logout</button> */}

                    <div className="profile-image-wrapper">
                        <img
                            src="/profilepic.jpg"
                            alt="Profile"
                            className="profile-image"
                        />
                    </div>

                    <h2 className="profile-username">{userDetails.username}</h2>
                    {userDetails.bio && <p className="profile-bio">{userDetails.bio}</p>}
                    {userDetails.email && <p className="profile-email">{userDetails.email}</p>}

                    <div className="follow-stats">
                        <p><strong>10</strong> Followers</p>
                        <p><strong>2</strong> Following</p>
                    </div>

                    {/* <button className="follow-btn">Follow</button> */}

                    <blockquote className="tech-quote">{randomQuote}</blockquote>
                </div>

                <div className="heatmap-section">
                    <h3 className="heatmap-heading">Your Contribution Activity</h3>
                    <HeatMapProfile />
                </div>
            </div><Footer/>
        </>
    );
};

export default Profile;
