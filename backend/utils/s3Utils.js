const { S3Client, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function listRepoFiles(repoName) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const prefix = `repos/${repoName}/`;

    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix
    });

    const response = await s3Client.send(command);

    if (!response.Contents) {
        return [];
    }

    const files = response.Contents
        .filter(item => item.Key !== prefix) // filter out folder placeholder
        .map(item => ({
            key: item.Key,
            size: item.Size,
            lastModified: item.LastModified
        }));

    return files; // ✅ always returns an array
}

async function getFileSignedUrl(key) {  // ✅ Accepts ONLY the full S3 key
    const bucketName = process.env.AWS_BUCKET_NAME;

    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
}

module.exports = { listRepoFiles, getFileSignedUrl };
