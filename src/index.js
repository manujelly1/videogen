const {extractKeywordsFromStory} = require("./utils/extractKeywords");
const path = require('path')
const {videoProcess} = require("./utils/videoProcess");
const {generateTTS, getAudioDuration} = require("./audio/generateAudio");
const {whisperTranscribe} = require("./api/whisper");
const {writeSrtFile} = require("./utils/WhisperProcessor");
const {mergeAudioWithVideo} = require("./audio/generateAudio");
const {getStoryFromPrompt} = require("./utils/getStoryFromPrompt");
const fs = require("fs");
const {addSubtitlesToVideo} = require("./utils/videoManage");
const {checkEnvironmentVariables} = require("./utils/common");

global.workdir = process.env.OUTPUT_DIRECTORY;

async function VideoGen({prompt = "", hasSubtitle= true, orientation = "landscape"}){
    checkEnvironmentVariables();

    if (prompt.length < 15){
        console.error(prompt)
        throw new Error("Prompt is too short. Min Prompt is 30 characters")
    }

    if (!fs.existsSync(workdir)) {
        fs.mkdirSync(workdir, {recursive: true});
    }

    const finalVideoPath = path.join(workdir, 'final-video.mp4');
    const finalVideoNoAudioPath = path.join(workdir, 'final-video-no-audio.mp4');
    const finalVideoWithAudioPath = path.join(workdir, 'release.mp4');
    const finalVideoWithAudioAndSubtitlePath = path.join(workdir, 'release-subtitle.mp4');

    const ttsAudioPath = path.join(workdir, 'story-audio.mp3');
    const transcribePath = path.join(workdir, 'transcribe.srt');


    console.log('Start Generate History From Prompt')
    const story = await getStoryFromPrompt(prompt);
    const parsedScript = JSON.parse(story).script

    console.log('Start Generate TTS Audio...')
    await generateTTS(parsedScript, ttsAudioPath);

    const audioDuration = await getAudioDuration(ttsAudioPath);
    console.log(`Audio duration: ${audioDuration} seconds`);

    console.log('Transcribe Audio For Video Make...')
    const transcribeAnalysis = await whisperTranscribe(ttsAudioPath);
    let transcribeArr = await writeSrtFile(transcribeAnalysis, transcribePath);

    const segments = [];

    for (let key in transcribeArr ){
        let keywords = await extractKeywordsFromStory(transcribeArr[key].segmentStory);
        segments.push([
            transcribeArr[key].timeRange,
            ...JSON.parse(keywords)
        ])
    }

    console.log('Start Video Process...')
    await videoProcess(segments, finalVideoPath, finalVideoNoAudioPath,orientation)
    //Remove Final Video NoAudioPath
    fs.rmSync(finalVideoPath, {force: true, recursive: true})



    console.log('Merge Audio With Video Process...')
    await mergeAudioWithVideo(finalVideoNoAudioPath, ttsAudioPath, finalVideoWithAudioPath);
    //Remove Merged Videos and audio
    fs.rmSync(finalVideoNoAudioPath, {force: true, recursive: true})
    fs.rmSync(ttsAudioPath, {force: true, recursive: true})

    if (!hasSubtitle){
        return finalVideoWithAudioPath;
    }

    console.log('Generate Subtitle for video...')
    await addSubtitlesToVideo(finalVideoWithAudioPath, transcribePath, finalVideoWithAudioAndSubtitlePath)
    //Remove Transcribe file
    fs.rmSync(transcribePath, {recursive: true, force: true})
    fs.rmSync(finalVideoWithAudioPath, {recursive: true, force: true})

    return finalVideoWithAudioAndSubtitlePath;
}

exports.videogen = VideoGen;

