import React, { useState } from 'react';
import Navbar from '../Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import './createIssue.css';

export default function CreateIssue() {
    const { repoId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/issue/create/${repoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                alert("Issue created successfully!");
                navigate("/dashboard"); // return to dashboard
            } else {
                const data = await response.json();
                alert(data.error || "Error while creating issue!");
            }
        } catch (err) {
            console.error("Error while creating issue:", err);
            alert("Server error while creating issue!");
        }
    };

    return (
        <>
        <Navbar/>
        <div className="create-issue-container">
            <h2>Create Issue</h2>
            <form onSubmit={handleSubmit} className="create-issue-form">
                <input
                    type="text"
                    placeholder="Issue Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Issue Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit" className="submit-issue-button">Create Issue</button>
            </form>
        </div>
        </>

    );
}
