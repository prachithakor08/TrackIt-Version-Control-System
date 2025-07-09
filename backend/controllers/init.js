const fs = require('fs').promises;
const path = require('path');

async function initRepo(repoName) {
    const repoPath = path.resolve(process.cwd(), ".newGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });

        const config = {
            repoName: repoName,
            bucket: process.env.AWS_BUCKET_NAME // ensure your .env has AWS_BUCKET_NAME
        };

        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify(config, null, 2) // prettified JSON for readability
        );

        console.log(`Repository '${repoName}' initialized successfully.`);
    } catch (err) {
        console.error("Error initializing repository:", err);
    }
}

module.exports = { initRepo };
