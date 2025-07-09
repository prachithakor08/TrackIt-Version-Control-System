const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');
const { listRepoFiles, getFileSignedUrl } = require('../utils/s3Utils');
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: process.env.AWS_REGION });
const bucketName = process.env.AWS_BUCKET_NAME;
const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const path = require('path');
const fs = require('fs');


async function  createRepository (req, res){
    const {owner , name , issues, content, description, visibility} = req.body;

    try{
        if(!name){
            return res.status(400).json({error: "Repository name is required!"});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({error: "Invalid userID!"});
        }

        const newRepository = new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues,
        });

        const result = await newRepository.save();

        res.status(201).json({
            message:"Repository created!",
            repositoryID:result._id,
        });

    }catch(err){
        console.error("Error during repository creation :",err.message);
        res.status(500).json("server error!");
    }
};

async function getAllRepositories  (req, res){
   try{
        const repositories = await Repository.find({})
        .populate("owner")
        .populate("issues");

        res.json(repositories);
   }catch(err){
        console.error("Error during fetching repositories :",err.message);
        res.json(500).send("Server error!");
   }
};

async function fetchRepositoryById (req, res){
    const  repoID  = req.params.id;

    try{
        const repository = await Repository.find({_id:repoID})
        .populate("owner")
        .populate("issues");

        res.json(repository);
    }catch(err){
        console.error("Error during fetching repository :",err.message);
        res.status(500).json("Server error!");
    }
};

async function fetchRepositoryByName  (req, res){
    const repoName  = req.params.name;

    try{
        const repository = await Repository.find({name:repoName})
        .populate("owner")
        .populate("issues");

        res.json(repository);
    }catch(err){
        console.error("Error during fetching repository :",err.message);
        res.status(500).json("Server error!");
    }
};


async function fetchRepositoryForCurrentUser (req, res){
    const userId = req.params.userId;
    try{
        const repositories = await Repository.find({owner:userId});
        res.json({ message: "Repositories fetched successfully", repositories });
    }catch(err){
        console.error("Error during fetching user repositories :",err.message);
        res.status(500).json("Server error!");
    }
};


async function updateReposirotyById (req, res){
    const { id } = req.params;
    const { content, description } = req.body;

    try{
        const repository = await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"});
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message:"Repository updated successfully!",
            repository: updatedRepository,
        });
    }catch(err){
        console.error("Error during updating user repository :",err.message);
        res.status(500).json("Server error!");
    }

};

async function toggleVisibilityById  (req, res){
    const { id } = req.params;

    try{
        const repository = await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"});
        }

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();

        res.json({
            message:"Repository visibility toggled successfully!",
            repository: updatedRepository,
        });
    }catch(err){
        console.error("Error during toggling visibility repository :",err.message);
        res.status(500).json("Server error!");
    }

};

async function deleteRepositoryById (req, res){
    const { id } = req.params;
    try{
        const repository = await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({error:"Repository not found"});
        }
        res.json({message:"Repository deleted successfully!"});
    }catch(err){
        console.error("Error during deleting repository :",err.message);
        res.status(500).json("Server error!");
    }
};
async function listRepoFilesForRepo (req, res) {
    try {
        const repoName = req.params.repoName;
        console.log("[listRepoFilesForRepo] Repo Name:", repoName);

        const files = await listRepoFiles(repoName);

        console.log("[listRepoFilesForRepo] Files fetched:", files);

        res.json(files);
    } catch (err) {
        console.error("[listRepoFilesForRepo] Error:", err);
        res.status(500).json({ error: "Error fetching files", details: err.message });
    }
}



async function getFileUrlForRepo(req, res) {
    const { repoName } = req.params;
    const { key } = req.query; // frontend sends ?key=...

    if (!key) {
        return res.status(400).json({ error: "Missing 'key' query parameter." });
    }

    try {
       // If the key already includes the full path, do not prepend again.
const finalKey = key.startsWith(`repos/${repoName}/`) ? key : `repos/${repoName}/${key}`;
const url = await getFileSignedUrl(finalKey);


        res.json({ url });
    } catch (err) {
        console.error("Error generating signed URL:", err.message);
        res.status(500).json({ error: "Unable to generate file URL." });
    }
}

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

async function generatePresignedUploadUrl(req, res) {
    const { repoName, fileName, fileType } = req.body;

    if (!repoName || !fileName || !fileType) {
        return res.status(400).json({ error: "repoName, fileName, and fileType are required." });
    }

    try {
        const key = `repos/${repoName}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: fileType,
        });

        const uploadURL = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

        res.json({ uploadURL, key });
    } catch (err) {
        console.error("Error generating upload pre-signed URL:", err);
        res.status(500).json({ error: "Could not generate pre-signed URL" });
    }
}

async function fetchRepoCommits(req, res) {
    const repoName = req.params.repoName;
    const prefix = `repos/${repoName}/commits/`;

    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix
        });
        const listedObjects = await s3.send(listCommand);

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log(`No commits found for repo ${repoName}`);
            return res.json([]); // return empty array if no commits found
        }

        // Filter to only commit.json files
        const commitFiles = listedObjects.Contents.filter(item => item.Key.endsWith("commit.json"));

        const commits = [];

        for (const file of commitFiles) {
            const getObjectCommand = new GetObjectCommand({
                Bucket: bucketName,
                Key: file.Key
            });
            const data = await s3.send(getObjectCommand);

            let body = "";
            for await (const chunk of data.Body) {
                body += chunk;
            }

            const commitData = JSON.parse(body);
            commits.push(commitData);
        }

        res.json(commits);
    } catch (err) {
        console.error("Error fetching commit data:", err);
        res.status(500).json({ error: "Error fetching commit data." });
    }
}


module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateReposirotyById,
    toggleVisibilityById,
    deleteRepositoryById,
    getFileUrlForRepo,
    listRepoFilesForRepo,
    fetchRepoCommits,
    generatePresignedUploadUrl
}