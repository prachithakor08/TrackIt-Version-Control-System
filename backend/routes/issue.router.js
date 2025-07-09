const express = require("express");
const issueController = require("../controllers/issueController");

const issueRouter = express.Router();

issueRouter.post("/issue/create/:id",issueController.createIssue);
issueRouter.put("/issue/update/:id",issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id",issueController.deleteIssueById);
issueRouter.get("/issue/all/:id",issueController.getAllIssues);
issueRouter.get("/issue/:id",issueController.getIssueById);


module.exports = issueRouter;