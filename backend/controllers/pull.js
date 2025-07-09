const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo(repoName) {
    const repoPath = path.resolve(process.cwd(), ".newGit");

    try {
        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: `repos/${repoName}/`,
        }).promise();

        const objects = data.Contents;

        if (!objects || objects.length === 0) {
            console.log("No commits found on S3 to pull.");
            return;
        }

        for (const object of objects) {
            const key = object.Key;
            const localFilePath = path.join(repoPath, key);

            // Ensure parent directories exist
            await fs.mkdir(path.dirname(localFilePath), { recursive: true });

            const params = {
                Bucket: S3_BUCKET,
                Key: key,
            };

            const fileContent = await s3.getObject(params).promise();
            await fs.writeFile(localFilePath, fileContent.Body);

            console.log(`✅ Pulled: ${key}`);
        }

        console.log("🚀 All commits pulled successfully from S3.");
    } catch (error) {
        console.error("❌ Unable to pull from S3:", error);
    }
}

module.exports = { pullRepo };
