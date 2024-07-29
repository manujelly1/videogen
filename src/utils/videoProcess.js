const {fetchVideosForStorySegments} = require("./fetchVideosForStorySegments");
const path = require("path");
const fs = require("fs");
const {downloadVideo, trimVideo, combineVideos} = require("./videoManage");
const {cleanUpTemporaryFiles, randomString} = require("./common");
const {removeAudio} = require("../audio/generateAudio");


async function videoProcess (segments, finalVideoPath, finalVideoNoAudioPath, orientation, mainKeyword){
    const videosPerSegment = await fetchVideosForStorySegments(segments, orientation, mainKeyword);

    for (const segment of videosPerSegment) {
        const [startTime, endTime] = segment.timeRange;
        const segmentDir = path.join(workdir, `segment-${startTime}-${endTime}`);
        fs.mkdirSync(segmentDir, { recursive: true });

        const videoPaths = [];
        const segmentDuration = endTime - startTime;
        const numKeywords = segment.segmentVideos.length;
        const subSegmentDuration = segmentDuration / numKeywords;

        for (let i = 0; i < segment.segmentVideos.length; i++) {
            const videoData = segment.segmentVideos[i];
            const keyword = videoData.keyword.replace(/\s/g, '');
            for (const video of videoData.videos) {
                const localFilePath = path.join(segmentDir, `${keyword}-${i}.mp4`);
                await downloadVideo(video, localFilePath);

                // Trim the video to fit the sub-segment's duration and set FPS
                const trimmedFilePath = path.join(segmentDir, `${keyword}-${i}-trimmed.mp4`);
                await trimVideo(localFilePath, trimmedFilePath, 0, subSegmentDuration);
                videoPaths.push(trimmedFilePath);
            }
        }

        // Combine all trimmed videos for this segment
        const combinedSegmentPath = path.join(workdir, `segment-${startTime}-${endTime}.mp4`);
        await combineVideos(videoPaths, combinedSegmentPath);

        //Remove segment dir
        fs.rmdirSync(segmentDir,{recursive: true})
        console.log(`Segment video for time range ${segment.timeRange} created at ${combinedSegmentPath}`);
    }

    // Combine all segment videos into the final video
    const allSegmentVideos = segments.map(segment =>
        path.join(workdir, `segment-${segment[0][0]}-${segment[0][1]}.mp4`)
    );

    await combineVideos(allSegmentVideos, finalVideoPath);
    console.log(`Final video created at ${finalVideoPath}`);

    //Remove All Videos Segments
    allSegmentVideos.map(item => fs.rmSync(item, {force: true, recursive: true}))

    // Remove audio from the final video
    await removeAudio(finalVideoPath, finalVideoNoAudioPath);
    console.log(`Final video without audio created at ${finalVideoNoAudioPath}`);

}



module.exports = {videoProcess}
