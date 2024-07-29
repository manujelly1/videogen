// src/api/pexels.js
const {createClient} = require('pexels')
const dotenv = require('dotenv');

dotenv.config();

/**
 * Fonction pour rechercher des vidéos sur Pexels basées sur un terme de recherche.
 * @param {string} query - Le terme de recherche pour les vidéos.
 * @param {number} perPage - Le nombre de vidéos à récupérer par page (max 80).
 * @returns {Promise<Array>} - Une liste d'URL de vidéos correspondant à la recherche.
 */
async function searchVideos(query, perPage = 5, orientation = 'portrait') {
    const client = createClient(process.env.PEXEL_API_KEY);
    const data = []
    let findVid;

    try {
        await client.videos.search({ query, per_page: perPage, orientation, min_duration: 10 }).then(res => {
            if (res.videos && res.videos.length > 0) {
                const videoIndex = Math.floor(Math.random() * res.videos.length);
                const video = res.videos[videoIndex];
                if (orientation === 'landscape'){
                    findVid = video.video_files.find(ft => (ft.height === 1080 && ft.width === 1920))
                    if (findVid){
                        data.push(findVid.link)
                    }
                } else {
                    findVid = video.video_files.find(ft => (ft.height === 1920 && ft.width === 1080))
                    if (findVid){
                        data.push(findVid.link)
                    }
                }
                // Retourner une liste d'URL de vidéos
            } else {
                throw new Error('No videos found for this query');
            }
        });

        return data;

    } catch (error) {
       // console.error('Error fetching videos from Pexels:', error);
        return data;
        // throw error;
    }
}

module.exports = { searchVideos };
