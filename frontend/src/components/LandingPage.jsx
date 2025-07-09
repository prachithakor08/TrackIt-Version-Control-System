import React from 'react'
import Navbar from './Navbar';
import './landing.css';
import { useNavigate } from "react-router-dom";
import Footer from './Footer';

export default function LandingPage() {

    const navigate = useNavigate();

    const handleTryIt = ()=>{
        navigate('/auth');
    }
  return (
    <>
    <Navbar/>  
      <div className="hero">
        <div className="text">
            <h1>Track Your Code, Collaborate, and Ship Faster</h1>
            <h4> designed to streamline your workflow, manage your repositories, and collaborate seamlessly with your team.</h4>
            <button className='tryIt' onClick={handleTryIt}>Track-It Today</button>
        </div>
        <div className="img-content">
            <img src='/github.png' alt='logo'/>
        </div>
      </div>
      
      <div className="section-2">
          <div className="img-2">
             <img src='/landingpage.png'/>
        </div>

        <div className="text-2">
            <h1>What is Track-it ?</h1>
            <p>TrackIt is a modern, intuitive version control system designed to help developers and teams manage their code efficiently. It allows you to create, track, and manage repositories effortlessly while providing seamless collaboration features that simplify your development workflow. With TrackIt, you can focus on writing great code while ensuring your projects stay organized, versioned, and ready for deployment.</p>
        </div>
      </div>

    <div className="features">
    <h1>Features</h1>
    <div className="features-cards">
        <div className="feature-card">
            <h3>Easy Repository Management</h3>
            <p>Create, clone, and manage your repositories effortlessly with a clean interface.</p>
        </div>
        <div className="feature-card">
            <h3>Real-time Collaboration</h3>
            <p>Track changes, review code, and collaborate with your team efficiently.</p>
        </div>
        <div className="feature-card">
            <h3>Seamless Integration</h3>
            <p>Integrate with your favorite IDEs and CI/CD pipelines for a complete workflow.</p>
        </div>
    </div>
</div>

<div className="cta-section">
    <h2>Ready to Level Up Your Projects?</h2>
    <p>Join TrackIt today and simplify your version control and team collaboration workflow.</p>
    <button className="tryIt" onClick={() => navigate('/auth')}>Register Now</button>
</div>
        <Footer/> 
    </>
  )
}
