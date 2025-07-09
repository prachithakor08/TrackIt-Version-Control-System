const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".newGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // Read repoName from .newGit/config.json
    const configData = await fs.readFile(path.join(repoPath, "config.json"), "utf-8");
    const config = JSON.parse(configData);
    const repoName = config.repoName;

    if (!repoName) {
      console.error("Error: repoName not found in .newGit/config.json.");
      return;
    }

    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);
        const params = {
          Bucket: S3_BUCKET,
          Key: `repos/${repoName}/commits/${commitDir}/${file}`, // <<-- includes repoName
          Body: fileContent,
        };

        await s3.upload(params).promise();
        console.log(`Uploaded: repos/${repoName}/commits/${commitDir}/${file}`);
      }
    }

    console.log(`✅ All commits for ${repoName} pushed to S3.`);
  } catch (err) {
    console.error("Error pushing to S3: ", err);
  }
}

module.exports = { pushRepo };
