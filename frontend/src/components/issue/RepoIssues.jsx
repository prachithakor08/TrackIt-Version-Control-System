import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './repositoryIssues.css';

export default function RepositoryIssues() {
    const { repoId } = useParams();
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await fetch(`http://localhost:3000/issue/all/${repoId}`);
                if (res.ok) {
                    const data = await res.json();
                    setIssues(data);
                } else {
                    setIssues([]);
                }
            } catch (err) {
                console.error("Error fetching issues:", err);
                setIssues([]);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, [repoId]);

    return (
        <div className="issues-container">
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>
            <h2>Issues for Repository</h2>
            {loading ? (
                <p>Loading issues...</p>
            ) : issues.length === 0 ? (
                <p>No issues found for this repository.</p>
            ) : (
                <ul className="issues-list">
                    {issues.map(issue => (
                        <li key={issue._id} className="issue-card">
                            <h3>{issue.title}</h3>
                            <p>{issue.description}</p>
                            <p>Status: <strong>{issue.status}</strong></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
