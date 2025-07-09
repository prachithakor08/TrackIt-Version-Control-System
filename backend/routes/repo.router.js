const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create",repoController.createRepository);
repoRouter.get("/repo/all",repoController.getAllRepositories);
repoRouter.get("/repo/:id",repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name",repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userId",repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/repo/update/:id",repoController.updateReposirotyById);
repoRouter.delete("/repo/delete/:id",repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id",repoController.toggleVisibilityById);
repoRouter.get("/repo/:repoName/files",repoController.listRepoFilesForRepo);
repoRouter.get("/repo/:repoName/file",repoController.getFileUrlForRepo);
repoRouter.get("/repo/:repoName/commits",repoController.fetchRepoCommits);
repoRouter.post('/generate-presigned-upload-url', repoController.generatePresignedUploadUrl);


module.exports = repoRouter;