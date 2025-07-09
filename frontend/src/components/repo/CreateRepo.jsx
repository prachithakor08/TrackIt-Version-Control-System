import React, { useState } from 'react';
import './createRepo.css';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar";
import Footer from "../Footer";

const CreateRepo = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // ✅ Correct placement

    const handleSubmit = async (e) => {
        e.preventDefault();
        const owner = localStorage.getItem('userId');
        if (!owner) {
            setMessage("User not logged in!");
            return;
        }
        if (!name) {
            setMessage("Repository name is required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/repo/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    owner,
                    name,
                    description,
                    visibility: visibility === 'public',
                    content: content ? [content] : [],
                    issues: []
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(`Repository created successfully! ID: ${data.repositoryID}`);
                setName('');
                setDescription('');
                setContent('');
                setVisibility('public');

                setTimeout(() => {
                    navigate("/"); // ✅ Redirect after success
                }, 1500); // Optional delay to show success message
            } else {
                setMessage(data.error || 'Error while creating repository!');
            }
        } catch (err) {
            console.error(err);
            setMessage("server error while creating repository!");
        }
    };

    return (
        <>
        <Navbar/>
        <div className="create-repo-container">
                               <h2>Create a New Repository</h2>
            <form className="create-repo-form" onSubmit={handleSubmit}>
                <label>Repository Name <span className="required">*</span></label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., trackit-dashboard"
                    required
                />

                <label>Description (optional)</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your repository"
                ></textarea>

                <label>Visibility</label>
                <div className="visibility-options">
                    <label>
                        <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={visibility === 'public'}
                            onChange={() => setVisibility('public')}
                        />
                        Public
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={visibility === 'private'}
                            onChange={() => setVisibility('private')}
                        />
                        Private
                    </label>
                </div>

                <label>Initialize with content (optional)</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="// your initial file content"
                ></textarea>

                <button type="submit" className="create-button">Create Repository</button>
            </form>
            {message && <p className="message">{message}</p>}
            </div>
        {/* <Footer/> */}
        
            <div className="img-container">
                <img src='/uploadFile.png' alt='img'/>
            </div>
    </>
    );
};

export default CreateRepo;
