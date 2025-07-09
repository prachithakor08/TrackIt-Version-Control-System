import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../App.css';

export default function AboutUs() {
    return (
        <>
            <Navbar />
            <div className="about-container">
                <div className="about-hero">
                    <h1>About TrackIt</h1>
                    <p>Empowering developers to collaborate, track, and ship code with confidence.</p>
                </div>

                <div className="about-content">
                    <div className="about-section">
                        <h2>Who We Are</h2>
                        <p>
                            TrackIt is a modern, intuitive version control system crafted by developers, for developers.
                            We believe that managing your code should be effortless, so you can focus on building great products.
                            Our mission is to simplify version control and collaboration with clean interfaces and seamless workflows.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>What We Do</h2>
                        <p>
                            From creating and managing repositories to real-time team collaboration, TrackIt provides everything you need to build and ship projects efficiently.
                            We integrate with your favorite IDEs, CI/CD pipelines, and project management tools to streamline your workflow.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>Our Vision</h2>
                        <p>
                            We envision a world where developers and teams, whether startups or enterprises, can collaborate without friction,
                            track changes transparently, and maintain clean, organized codebases ready for scalable deployment.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
