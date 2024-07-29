const fs = require('fs');
const path = require('path');
/**
 * Recursively deletes the specified directory and all its contents.
 * @param {string} directoryPath - The path of the directory to delete.
 */
function deleteFolderRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
}

/**
 * Cleans up temporary files and directories, excluding the specified file.
 * @param {string} excludeFilePath - The path of the file to exclude from deletion.
 */
function cleanUpTemporaryFiles(excludeFilePath) {
    const currentDir = __dirname;
    const tempPrefixes = ['segment-', 'temp-']; // Add prefixes or patterns for temp files/directories

    fs.readdirSync(currentDir).forEach(file => {
        const fullPath = path.join(currentDir, file);
        if (fullPath !== excludeFilePath && tempPrefixes.some(prefix => file.startsWith(prefix))) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                deleteFolderRecursive(fullPath);
            } else {
                fs.unlinkSync(fullPath);
            }
        }
    });

    console.log('Temporary files and directories cleaned up.');
}


function randomString(length = 20) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function checkEnvironmentVariables(){
    if (!process.env.OPENAI_KEY){
        throw new Error("OPENAPI_KEY is not defined. Please create an .env file and set this variable ")
    } else if (!process.env.OPENAI_MODEL){
        throw new Error("OPENAI_MODEL is not defined. Please create an .env file and set this variable ")
    } else if (!process.env.PEXEL_API_KEY) {
        throw new Error("PEXEL_API_KEY is not defined. Please create an .env file and set this variable ")
    } else if (!process.env.OPENAI_TRANSCRIPTION_MODEL){
        throw new Error("OPENAI_TRANSCRIPTION_MODEL is not defined. Please create an .env file and set this variable ")
    } else if (!process.env.OUTPUT_DIRECTORY){
        throw new Error("OUTPUT_DIRECTORY is not defined. Please create an .env file and set this variable ")
    }
}

module.exports = {cleanUpTemporaryFiles, randomString, checkEnvironmentVariables}
