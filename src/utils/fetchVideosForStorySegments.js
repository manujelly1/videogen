const { searchVideos } = require('../api/pexels');

// Mots-clés génériques pour la recherche aléatoire
const randomKeywords = [
    "nature",
    "travel",
    "city",
];

function getRandomKeyword() {
    return randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
}

async function fetchVideosForStorySegments(segments, orientation, mainKeyword) {
    let videosPerSegment = [];

    for (const segment of segments) {
        const [timeRange, primaryKeywords, secondaryKeywords, phrases] = segment;
        let segmentVideos = [];

        // Combine all keywords (primary, secondary, and phrases)
        const allKeywords = [
            primaryKeywords,
            secondaryKeywords,
            phrases
        ];

        // Process each keyword
        for (const keyword of allKeywords) {
            try {
                let videos = await searchVideos(keyword, 8, orientation);
                // If no videos are found, perform a random search
                if (videos.length === 0) {
                    console.log(`No videos found for keyword "${keyword}". Performing a random search.`);
                    videos = await searchVideos(mainKeyword, 8, orientation);
                    if (videos.length === 0){
                        console.log("Nothing found with main keyword. Start search with random")
                        const randomKeyword = getRandomKeyword();
                        videos = await searchVideos(randomKeyword, 8, orientation);
                    }
                }
                // Add found videos to the segment's results
                segmentVideos.push({
                    keyword,
                    videos
                });
            } catch (error) {
                console.log(`Error fetching videos for keyword "${keyword}":`);
                segmentVideos.push({
                    keyword,
                    videos: 'Error fetching videos'
                });
            }
        }

        // Add results for the current segment
        videosPerSegment.push({
            timeRange,
            segmentVideos
        });
    }

    return videosPerSegment;
}
module.exports = {fetchVideosForStorySegments}
// Exemple d'utilisation

