import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './userGuide.css';

export default function UserGuide() {
    return (
        <>
            <Navbar />
            <div className="user-guide-container">
                <h1>TrackIt User Guide</h1>

                <section className="guide-section">
                    <h2>🚀 What is TrackIt?</h2>
                    <p>
                        TrackIt is a modern, intuitive version control system designed for developers and teams to manage, track, and collaborate on code seamlessly. It integrates repository management with cloud storage, allowing you to efficiently push, store, and access your projects securely anytime, anywhere.
                    </p>
                </section>

                <section className="guide-section">
                    <h2>🗂️ How We Store Files</h2>
                    <p>
                        When you push files to TrackIt, we store metadata (file name, structure, commit history) in our MongoDB database, while the actual file content is securely stored in AWS S3 buckets. This keeps your repositories organized, version-controlled, and backed up in the cloud.
                    </p>
                </section>

                <section className="guide-section">
                    <h2>💻 How to Upload and Manage Files Using TrackIt</h2>
                    <ol>
                        <li><strong>Login & Create Repository:</strong> After logging in on the frontend, create a repository by specifying its name and description.</li>
                        <li><strong>Initialize in Local CLI:</strong> In your local system, open your terminal and run:
                            <pre><code>node index.js init &lt;repoName&gt;</code></pre>
                            Ensure <code>repoName</code> matches the name you created on the frontend.
                        </li>
                        <li><strong>Add Files to Staging:</strong> To add files, use:
                            <pre><code>node index.js add &lt;filename&gt;</code></pre>
                        </li>
                        <li><strong>Commit Your Changes:</strong> Commit your staged files with a message:
                            <pre><code>node index.js commit "commit message"</code></pre>
                        </li>
                        <li><strong>Push Files to Cloud:</strong> Push your committed changes to AWS S3 using:
                            <pre><code>node index.js push</code></pre>
                            You will receive a confirmation message indicating successful upload.
                        </li>
                        <li><strong>Revert to a Previous Commit:</strong> If you need to revert your repository to a previous state, use:
                            <pre><code>node index.js revert &lt;commitId&gt;</code></pre>
                            This will safely revert your repository to the specified commit.
                        </li>
                        <li><strong>View Your Repository:</strong> On the frontend dashboard:
                            <ul>
                                <li>Check which files are currently in your repository</li>
                                <li>View commits with their date, time, and messages</li>
                                <li>Download, edit, and upload new files directly</li>
                            </ul>
                        </li>
                        <li><strong>Manage Issues:</strong> You can create and view issues for each repository to track tasks and bugs effectively.</li>
                        <li><strong>Delete Repository:</strong> If needed, you can safely delete your repository from the frontend dashboard.</li>
                    </ol>
                </section>

                <section className="guide-section">
                    <h2>🌐 Frontend Repository Access with S3</h2>
                    <p>
                        Each repository on TrackIt is linked to a managed S3 bucket where your files are securely stored. Using our dashboard, you can:
                        <ul>
                            <li>View your repository structure and files in real-time</li>
                            <li>Download and edit files easily</li>
                            <li>Upload new files directly</li>
                            <li>Access and view your version history securely</li>
                        </ul>
                    </p>
                </section>

                <section className="guide-section">
                    <h2>🎯 Benefits of Using TrackIt</h2>
                    <ul>
                        <li>⚡ Fast, reliable version control without heavy local dependencies</li>
                        <li>🌩️ Cloud-backed storage with S3 for secure, scalable file management</li>
                        <li>🤝 Seamless collaboration with your team</li>
                        <li>🔍 Easy repository tracking, history view, and rollback</li>
                        <li>💡 Accessible from any device with an intuitive frontend</li>
                        <li>🔐 Secure file storage with encryption at rest</li>
                    </ul>
                </section>
            </div>
            <Footer />
        </>
    );
}
