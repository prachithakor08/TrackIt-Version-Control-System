import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQueryMyRepos, setSearchQueryMyRepos] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuerySuggestedRepos, setSearchQuerySuggestedRepos] = useState("");

  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoFiles, setRepoFiles] = useState([]);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [repoToDelete, setRepoToDelete] = useState(null);
const [deleteInputName, setDeleteInputName] = useState("");


const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);
const [repoIssues, setRepoIssues] = useState([]);
const [selectedRepoName, setSelectedRepoName] = useState("");

  // Add below your useState declarations
const events = [
    {
        name: "TrackIt Launch Webinar",
        description: "Learn how to use TrackIt effectively for your projects.",
        venue: "Online - Zoom"
    },
    {
        name: "Open Source Sprint",
        description: "Collaborate and contribute to open-source repositories.",
        venue: "BVCW Auditorium"
    },
    {
        name: "Version Control Best Practices",
        description: "Master branching, merging, and efficient collaboration.",
        venue: "Lab 301"
    },
    {
        name: "Cloud Workflow with TrackIt",
        description: "Learn to integrate TrackIt with CI/CD pipelines using AWS S3.",
        venue: "Seminar Hall"
    }
];


  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fetching user repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching suggested repositories:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  const filteredMyRepos = (repositories || []).filter((repo) =>
    repo.name.toLowerCase().includes(searchQueryMyRepos.toLowerCase())
  );

  const filteredSuggestedRepos = suggestedRepositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuerySuggestedRepos.toLowerCase())
  );

    const handleCreateIssue = (repoId) => {
      navigate(`/createIssue/${repoId}`);
    };

  const handleViewFiles = async (repoName) => {
  try {
    const [filesRes, commitsRes] = await Promise.all([
      fetch(`http://localhost:3000/repo/${repoName}/files`),
      fetch(`http://localhost:3000/repo/${repoName}/commits`)
    ]);

    if (!filesRes.ok) {
      const errorData = await filesRes.json();
      alert(errorData.error || "Repository does not exist or could not fetch files.");
      return;
    }
    if (!commitsRes.ok) {
      const errorData = await commitsRes.json();
      alert(errorData.error || "Could not fetch commits.");
      return;
    }

    const filesData = await filesRes.json();       // [{ key, size, lastModified }, ...]
    const commitsData = await commitsRes.json();   // [{ message, date }, ...]

    const latestCommit = commitsData.length > 0 ? commitsData[commitsData.length - 1] : null;

    const filesWithCommits = filesData.map(file => {
      const cleanKey = file.key.replace(`repos/${repoName}/`, "");

      return {
        ...file,
        cleanKey,
        sizeKB: (file.size / 1024).toFixed(2),
        lastModifiedFormatted: new Date(file.lastModified).toLocaleString(),
        commitMessage: latestCommit ? latestCommit.message : "No commit data",
        commitDate: latestCommit ? new Date(latestCommit.date).toLocaleString() : "N/A"
      };
    });

    setRepoFiles(filesWithCommits);
    setSelectedRepo(repoName);
    setIsFilesModalOpen(true);

  } catch (err) {
    console.error("Error fetching repository files or commits:", err);
    alert("Error fetching repository files or commits.");
  }
};

const handleUploadFile = async (repoName, file) => {
    try {
        // Step 1: Get signed URL
        const res = await fetch('http://localhost:3000/generate-presigned-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repoName,
                fileName: file.name,
                fileType: file.type,
            }),
        });
        const { uploadURL } = await res.json();

        // Step 2: Upload file directly to S3
        const uploadRes = await fetch(uploadURL, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });

        if (uploadRes.ok) {
            alert('File uploaded successfully!');
        } else {
            alert('Error uploading file.');
        }
    } catch (err) {
        console.error(err);
        alert('Error uploading file.');
    }
};

const handleConfirmDelete = async () => {
  if (!repoToDelete) return;

  if (deleteInputName.trim() !== repoToDelete.name) {
    alert("Repository name does not match. Please retype the exact name to confirm deletion.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/repo/delete/${repoToDelete._id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
      setRepositories(prevRepos => prevRepos.filter(repo => repo._id !== repoToDelete._id));
      alert(data.message || "Repository deleted successfully!");
    } else {
      alert(data.error || "Error while deleting repository!");
    }
  } catch (err) {
    console.error("Error while deleting repository:", err);
    alert("Server error while deleting repository!");
  } finally {
    setIsDeleteModalOpen(false);
    setRepoToDelete(null);
  }
};
const handleViewIssues = async (repoId, repoName) => {
    try {
        const response = await fetch(`http://localhost:3000/issue/all/${repoId}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Could not fetch issues for this repository.");
            return;
        }

        setRepoIssues(data);
        setSelectedRepoName(repoName);
        setIsIssuesModalOpen(true);
    } catch (err) {
        console.error("Error while fetching issues:", err);
        alert("Server error while fetching issues.");
    }
};

  const handleOpenFile = async (key) => {
    try {
      const response = await fetch(`http://localhost:3000/repo/${selectedRepo}/file?key=${encodeURIComponent(key)}`);
      const data = await response.json();
      window.open(data.url, "_blank");
    } catch (err) {
      console.error("Error generating signed URL:", err);
      alert("Error opening file.");
    }
  };

  return (
    <>
      <Navbar />

   <section id="dashboard">

<h2 className="section-heading">Your Repositories</h2>
<input
    type="text"
    placeholder="Search your repositories..."
    value={searchQueryMyRepos}
    onChange={(e) => setSearchQueryMyRepos(e.target.value)}
    className="search-input"
/>

<div className="cards-container">
    {filteredMyRepos.map((repo) => (
        <div key={repo._id} className="repo-card">
            <h4 className="repo-title">{repo.name}</h4>
            <p className="repo-description">{repo.description}</p>

            <div className="card-footer">
                <div className="button-grid">
                    <button
                        onClick={() => handleViewFiles(repo.name)}
                        className="view-files-button"
                    >
                        View Files
                    </button>
                    <button
                        onClick={() => handleCreateIssue(repo._id)}
                        className="view-files-button"
                    >
                        New Issue
                    </button>
                    <button
                        onClick={() => handleViewIssues(repo._id, repo.name)}
                        className="view-files-button"
                    >
                        View Issues
                    </button>
                    <button
                        className="view-files-button"
                        onClick={() =>
                            document.getElementById(`fileInput-${repo._id}`).click()
                        }
                    >
                        Upload File
                    </button>
                    <input
                        type="file"
                        id={`fileInput-${repo._id}`}
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                handleUploadFile(repo.name, file);
                            }
                        }}
                    />
                </div>

                <div className="delete-icon-container">
                    <i
                        className="fa-solid fa-trash delete-icon"
                        onClick={() => {
                            setRepoToDelete(repo);
                            setDeleteInputName("");
                            setIsDeleteModalOpen(true);
                        }}
                        title="Delete Repository"
                    ></i>
                </div>
            </div>
        </div>
    ))}
</div>

  

    <h2 className="section-heading">Suggested Repositories</h2>
    <input
        type="text"
        placeholder="Find a repository"
        value={searchQuerySuggestedRepos}
        onChange={(e) => setSearchQuerySuggestedRepos(e.target.value)}
        className="search-input"
    />
    <div className="cards-container">
        {filteredSuggestedRepos.map((repo) => (
   <div key={repo._id} className="suggested-card">
    <div className="repo-header">
        <h4>{repo.name}</h4>
    </div>
    <div className="card-footer">
        <button
            onClick={() => handleViewFiles(repo.name)}
            className="view-files-button"
        >
            View Files
        </button>
        <button
            onClick={() => handleViewIssues(repo._id, repo.name)}
            className="view-files-button"
        >
            View Issues
        </button>
    </div>
</div>

    ))}
    </div>
  

    <h2 className="section-heading">Upcoming Events</h2>
    <div className="cards-container">
    {events.map((event, idx) => (
        <div key={idx} className="event-card">
            <div className="event-header">
                <h4>{event.name}</h4>
            </div>
            <p>{event.description}</p>
            <p><strong>Venue:</strong> {event.venue}</p>

        </div>
        
    ))}
    </div>
    

</section>


      {isFilesModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFilesModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Files in {selectedRepo}</h3>
            <button className="close-button" onClick={() => setIsFilesModalOpen(false)}>X</button>
            {repoFiles.length === 0 ? (
              <p>No files found.</p>
            ) : (
          <ul className="file-list">
  {repoFiles.map(file => (
    <li key={file.key} className="file-item">
      <div><strong>Name:</strong> {file.cleanKey}</div>
      <div><strong>Size:</strong> {file.sizeKB} KB</div>
      <div><strong>Last Modified:</strong> {file.lastModifiedFormatted}</div>
      <div><strong>Last Commit:</strong> {file.commitMessage}</div>
      <div><strong>Commit Date:</strong> {file.commitDate}</div>
      <button
        onClick={() => handleOpenFile(file.key)}
        className="view-file-button"
        style={{ marginTop: "5px" }}
      >
        View File
      </button>
    </li>
  ))}
</ul>
            )}
          </div>
        </div>
      )}

{isDeleteModalOpen && (
  <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Confirm Repository Deletion</h3>
      <p>To confirm deletion, please type the repository name below:</p>
      <input
        type="text"
        value={deleteInputName}
        onChange={(e) => setDeleteInputName(e.target.value)}
        placeholder="Retype repository name"
        className="search-input"
        style={{ marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
        <button
          onClick={handleConfirmDelete}
          className="view-files-button"
          style={{ backgroundColor: "#f85149" }}
        >
          Confirm Delete
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="view-files-button"
          style={{ backgroundColor: "#gray" }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{isIssuesModalOpen && (
  <div className="modal-overlay" onClick={() => setIsIssuesModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Issues for {selectedRepoName}</h3>
      <button className="close-button" onClick={() => setIsIssuesModalOpen(false)}>X</button>

      {repoIssues.length === 0 ? (
        <p>No issues found for this repository.</p>
      ) : (
        <ul className="file-list">
          {repoIssues.map(issue => (
            <li key={issue._id} className="file-item">
              <div><strong>Title:</strong> {issue.title}</div>
              <div><strong>Description:</strong> {issue.description}</div>
              <div><strong>Status:</strong> {issue.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}


      <Footer />
    </>
  );
};

export default Dashboard;
