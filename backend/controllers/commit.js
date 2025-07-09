const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');//for generating unique id's


async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(),".newGit");
    const stagedPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath,"commits");

    try{
        const commitID = uuidv4();//generating unique id
        const commitDir = path.join(commitPath,commitID);
        await fs.mkdir(commitDir, {recursive:true});

        const files = await fs.readdir(stagedPath);//read all files in staging 
        
        //handle empty staging area
        if (files.length === 0) {
             console.log("⚠️ No files to commit in staging. Commit aborted.");
             return;
        }

        for(const file of files){
            await fs.copyFile(
                path.join(stagedPath,file),
                path.join(commitDir,file)
        );
    }
        await fs.writeFile(
            path.join(commitDir,"commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() }, null, 2)
     );

     console.log( `Commit ${commitID} created with message : ${message}`);
    }catch(err){
        console.log("Error commiting files :",err);
    }

}
module.exports = { commitRepo };