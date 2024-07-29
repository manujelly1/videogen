const axios = require('axios');
const fs =  require('fs');
const { exec } = require('child_process');
const path = require("path");

async function downloadVideo(url, outputPath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading video from ${url}:`, error);
    }
}

function trimVideo(inputPath, outputPath, startTime, duration, fps = 25) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -y -i ${inputPath} -ss ${startTime} -t ${duration + 0.1} -r ${fps} -c:v libx264 -c:a aac ${outputPath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error trimming video: ${stderr}`);
                reject(error);
            } else {
                console.log(`Successfully trimmed video to ${outputPath} with FPS ${fps}`);
                resolve();
            }
        });
    });
}


function combineVideos(videoPaths, outputPath) {
    const fileListPath = path.join(__dirname, 'video-list.txt');
    const fileListContent = videoPaths.map(p => `file '${p}'`).join('\n');

    fs.writeFileSync(fileListPath, fileListContent);

    return new Promise((resolve, reject) => {
        exec(`ffmpeg -f concat -safe 0 -i ${fileListPath} -c copy ${outputPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error combining videos:`, stderr);
                reject(error);
            } else {
                console.log(`Successfully combined videos into ${outputPath}`);
                resolve();
            }
        });
    });
}

function addSubtitlesToVideo(inputVideoPath, inputSrtPath, outputVideoPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${inputVideoPath} -vf "subtitles=${inputSrtPath}" -c:a copy ${outputVideoPath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'ajout des sous-titres : ${stderr}`);
                reject(error);
            } else {
                console.log(`Sous-titres ajoutés avec succès. Vidéo de sortie : ${outputVideoPath}`);
                resolve();
            }
        });
    });
}


module.exports = {trimVideo, downloadVideo, combineVideos, addSubtitlesToVideo}
