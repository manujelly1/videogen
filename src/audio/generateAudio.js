const { exec } = require('child_process');
const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');
const fs = require('fs');
const path = require('path');

// Creates a client
const client = new textToSpeech.TextToSpeechClient({});

/**
 * Converts text to speech and saves it as an audio file.
 * @param {string} text - The text to convert to speech.
 * @param {string} outputAudioPath - The path where the audio file will be saved.
 * @returns {Promise<void>}
 */
async function generateTTS(text, outputAudioPath) {
    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        // Select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    await util.promisify(fs.writeFile)(outputAudioPath, response.audioContent, 'binary');
    console.log(`Audio content written to file: ${outputAudioPath}`);
}

function mergeAudioWithVideo(inputVideoPath, inputAudioPath, outputVideoPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${inputVideoPath} -i ${inputAudioPath} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ${outputVideoPath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error merging audio and video: ${stderr}`);
                reject(error);
            } else {
                console.log(`Successfully merged audio with video. Output video: ${outputVideoPath}`);
                resolve();
            }
        });
    });
}

function removeAudio(inputVideoPath, outputVideoPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${inputVideoPath} -an -c:v copy ${outputVideoPath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error removing audio from video: ${stderr}`);
                reject(error);
            } else {
                console.log(`Successfully removed audio. Output video: ${outputVideoPath}`);
                resolve();
            }
        });
    });
}

function getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
        const command = `ffprobe -i ${audioPath} -show_entries format=duration -v quiet -of csv="p=0"`;
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(parseFloat(stdout.trim()));
            }
        });
    });
}

module.exports = {generateTTS, mergeAudioWithVideo, removeAudio, getAudioDuration}
