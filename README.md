# 🚀 TrackIt - Your Personal Git + S3 Project Tracker

**Mimics GitHub commands to push, pull, and track your projects on AWS S3, 
<br>providing a simple, intuitive interface for managing your code securely.**


## 🌐 Live Frontend (Quick Review)

> Deployed for UI/UX review (backend requires local execution for security)

[🔗 View TrackIt Frontend on Vercel](track-it-version-control-system.vercel.app)

## 🎥 Demo Video

View the **complete workflow demo**, including init, push, pull, issue management, and S3 interaction:

[▶️ Watch TrackIt in Action](https://your-drive-or-youtube-link)

## 📌 What is TrackIt?

**TrackIt** is a **developer-focused version control and project tracking system** that:

✅ **Mimics GitHub commands (`init`, `add`, `commit`, `push`, `pull`,`revert`)** for local repositories.  
✅ **Pushes your project files to AWS S3** for **secure cloud storage and backup**.  
✅ Allows you to **view, download, and manage your files from a clean frontend**.  
✅ Lets you **create and view issues** for your projects directly from the TrackIt dashboard.  
✅ Supports **uploading files from TrackIt and pulling them locally using the pull command** for seamless sync.


## 🛠️ **How TrackIt Works (Process)**

1️⃣ **Create a repository on TrackIt:**  <br>
   Example: "demoRepo"

2️⃣ **Initialize your local repo with TrackIt:**                                            
   **node index.js init demoRepo**<br>
   ✅ This:<br>
     💠Initializes a Git repository locally and on S3(like git init).<br>
     💠Links your local repo to the demoRepo you created on TrackIt.<br>
     💠Prepares it to sync with TrackIt and your S3 bucket.<br>

3️⃣ **Add files to your repo**<br>
    **node index.js add <FileName>**<br>
   ✅ This:<br>
     💠Adds all your project files to the local staging area.<br>
     💠Equivalent to git add ..<br>

4️⃣ Commit your changes with a message<br>
    **node index.js commit <commit-message>**<br>
    ✅ This:<br>
      💠Records a snapshot of your current project state with your commit message.<br>
      💠Stores the commit time and date for tracking on TrackIt.<br>
      💠quivalent to git commit -m "message".<br>

5️⃣ Push your project to TrackIt (and AWS S3)<br>
    **node index.js push**<br>
    ✅ This:<br>
      💠Syncs your committed project files to your AWS S3 bucket securely.<br>
      💠Updates the TrackIt dashboard with your commit message, timestamp, and file list.<br>
      💠Allows you to view and download any files from TrackIt from anywhere.<br>
      💠Equivalent to git push, but instead of GitHub, your files are securely stored in your private <br>
          S3 storage.<br>

6️⃣ View your files and commit history on TrackIt<br>
    ✅ From the frontend:<br>
      💠View all your commits with messages, dates, and times.<br>
      💠Browse and download all types of files (code, PDFs, images, datasets).<br>
      💠Manage your project remotely, ensuring your files are backed up.<br>
        
7️⃣ Upload files directly via TrackIt<br>
      If you want to add files directly:<br>
      💠Use the Upload feature on TrackIt’s frontend.<br>
      💠Upload single or multiple files from your system.<br>
      💠These files will be stored in your S3 bucket and linked to your project.<br>

8️⃣ Pull files from TrackIt to your local system:<br>
  If you uploaded files via TrackIt and want them locally:<br>
  **node index.js pull <repository-Name>**<br>
  ✅ This:<br>
     💠Fetches all files and updates from your TrackIt repo/S3 bucket.<br>
     💠Syncs them to your local project folder.<br>
     💠Equivalent to git pull, but using your S3 storage as the remote.<br>

🔄 Reverting a Commit in TrackIt<br>
  **node index.js revert <commmitId>**<br>
      💠TrackIt also supports revert — you can undo any commit by just simply running this revert<br>
        command with commit id (you can get commit id from frontend easily).<br>
      💠You can use revert to safely roll back unwanted changes. The revert is recorded in your <br>
        commit history and synced to S3 when you push again.<br>

  🚀 Why Use TrackIt? <br>
✅ Git-like workflow: Use familiar init, add, commit, push, pull, and revert commands for version<br>
    control without learning new syntax.<br>
✅ Secure S3-backed storage: Your projects are safely stored in AWS S3, providing private, reliable<br>
    cloud backups.<br>
✅ Intuitive frontend: View commits, download files, manage issues, and upload files easily without <br>
    touching the CLI.<br>
✅ Pull files anywhere: Sync your updated projects from TrackIt to your local machine on any system.<br>
✅ Issue tracking: Manage bugs, enhancements, and tasks for your projects directly from the TrackIt
    dashboard.<br>
    
## 🛠️ Tech Stack
💠**Frontend:** React.js (deployed on Vercel)<br>
💠**Backend:** Node.js, Express.js (runs locally for CLI operations)<br>
💠**Storage:** AWS S3<br>
💠**Version Control:** Git CLI mimic via Node<br>
💠**Deployment:** Vercel (frontend)<br>

## 🖥️ Local Setup<br>
TrackIt requires backend CLI commands to be executed locally for security.<br>

1️⃣ Clone the repository:<br>
    git clone https://github.com/prachithakor08/TrackIt.git<br>

2️⃣ Install dependencies:<br>
    npm install<br>
    
3️⃣ Add your .env file with AWS credentials and bucket name.<br>

4️⃣ Run your CLI commands:<br>
-node index.js init <repoName><br>
-node index.js add <fileName><br>
-node index.js commit "<commit-message>"<br>
-node index.js push<br>
-node index.js pull <repoName><br>
-node index.js revert <commitId><br>

📸 Screenshots<br>
