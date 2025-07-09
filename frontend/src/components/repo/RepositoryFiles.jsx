import React, { useEffect, useState } from "react";
import axios from "axios";

const RepositoryFiles = ({ repoName }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await axios.get(`/api/repos/${repoName}/files`);
                setFiles(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchFiles();
    }, [repoName]);

    const handleViewFile = async (key) => {
        try {
            const res = await axios.get(`/api/repos/${repoName}/file`, { params: { key } });
            window.open(res.data.url, "_blank");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading files...</p>;

    return (
        <div>
            <h3>Files in {repoName}</h3>
            {files.length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul>
                    {files.map((file) => (
                        <li key={file.key}>
                            {file.key.replace(`repos/${repoName}/`, "")} 
                            <button onClick={() => handleViewFile(file.key)} style={{ marginLeft: "10px" }}>
                                View
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RepositoryFiles;
