const fs =  require('fs');

function formatTime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return date.toISOString().substr(11, 8) + ',' + milliseconds.toString().padStart(3, '0');
}

// Fonction pour diviser un segment en sous-segments basés sur le nombre max de mots
function splitSegment(segment) {
    const maxWordsPerSubtitle = 5
    const words = segment.text.split(' ');
    const segments = [];
    let currentSegment = [];
    let startTime = segment.start;
    const timePerWord = (segment.end - segment.start) / words.length;

    words.forEach((word, index) => {
        currentSegment.push(word);
        if (currentSegment.length >= maxWordsPerSubtitle || index === words.length - 1) {
            const endTime = startTime + timePerWord * currentSegment.length;
            segments.push({
                start: startTime,
                end: endTime,
                text: currentSegment.join(' ')
            });
            startTime = endTime;
            currentSegment = [];
        }
    });

    return segments;
}

async function writeSrtFile(analysis, srtPath) {
    let srtContent = '';
    let subtitleIndex = 1;
    const durationSegments = [];

    analysis.segments.forEach(segment => {
        durationSegments.push({timeRange :[segment?.start, segment?.end], segmentStory: segment?.text})

        const subSegments = splitSegment(segment);
        subSegments.forEach(subSegment => {
            const start = formatTime(subSegment.start);
            const end = formatTime(subSegment.end);
            srtContent += `${subtitleIndex}\n${start} --> ${end}\n${subSegment.text.trim()}\n\n`;
            subtitleIndex++;
        });
    });

    fs.writeFileSync(srtPath, srtContent);

    return durationSegments;
}

module.exports = {writeSrtFile}
