const fs = require("fs").promises;
const path = require('path');


async function addRepo(filePath){
    const repoPath = path.resolve(process.cwd(),".newGit");
    const stagingPath = path.join(repoPath, 'staging');

    try{
        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);//reading file 
        await fs.copyFile(filePath, path.join(stagingPath, fileName));//creating copy 
        console.log(`File ${fileName} added to the staging area!` );
    
    }catch(err){
    
        console.log("Error adding file :", err);
    
    }
}
module.exports = { addRepo };