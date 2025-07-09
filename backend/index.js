const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require("http");
const yargs = require('yargs');
const mainRouter = require('./routes/main.router');

const { Server } = require('socket.io');

const { hideBin } = require("yargs/helpers");//helps to read arguments
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pullRepo } = require('./controllers/pull');
const { pushRepo } = require('./controllers/push');
const { revertRepo } = require('./controllers/revert');

dotenv.config();

//here command('coomand name','description if user calls help',{parameter},what will happen login)
yargs(hideBin(process.argv))
.command("start","starts a new server",{},startServer)
.command('init <repoName>', 'Initialise a new repository',(yargs)=>{
    yargs.positional("repoName",{
        describe:"name of the repository you want to create",
        type:"string"
    });
},(argv)=>{
    initRepo(argv.repoName);
})
.command('add <file>','Add a file to the repository',(yargs)=>{
yargs.positional("file",{
    describe: "File to add to the staging area",
    type:"string",
});
},
(argv)=>{
    addRepo(argv.file);
})
.command('commit <message>', 'commit the staged files',(yargs)=>{
    yargs.positional("message",{
        describe:"commit message",
        type:"string",
    });
},(argv)=>{
    commitRepo(argv.message);
})
.command("push", "Push commits to S3", {}, pushRepo)
.command('pull <repoName>', 'pull commits from the repository',(yargs)=>{
    yargs.positional("repoName",{
        describe:"repo name",
        type:"string",
    });
},(argv)=>{
    pullRepo(argv.repoName);
})
.command('revert <commitID>', 'revert to specific commit',(yargs)=>{
    yargs.positional("commitID",{
        describe:"Commit ID to revert to",
        type:"string",
    });
},
(argv)=>{
    revertRepo(argv.commitID);
})
.demandCommand(1,"You need atleast one command")
.help().argv;


function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGODB_URI;

    mongoose
    .connect(mongoURI,{dbName:"githubclone"})
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log("Unable to connect :",err));

    app.use(cors({origin:"*"}));

    app.use("/", mainRouter);
    
    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer,{
        cors:{
            origin:"*",
            methods:["GET","POST"], 
        },
    });

    io.on("connection",(socket)=>{
        socket.on("joinRoom",(userID) => {
            user = userID;
            console.log("=====");
            console.log(user);
            console.log("=====");
            socket.join(userID);
        });
    });

    const db = mongoose.connection;

    db.once("open", async ()=>{
        console.log("CRUD operations called");
        //CRUD operations
    });

    httpServer.listen(port,()=>{
        console.log(`Server is running on PORT ${port}`);
    });
}