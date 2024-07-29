const OpenAI = require('openai');
const dotenv = require("dotenv");
const fs =  require('fs');

dotenv.config();

async function whisperTranscribe(audioPath) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    try {
        const whisper = await client.audio.translations.create({
            file: fs.createReadStream(audioPath),
            model: process.env.OPENAI_TRANSCRIPTION_MODEL,
            response_format: "verbose_json",
            timestamp_granularities: ["segment"]
        });

        return whisper;
    } catch (error) {
        console.error('Error transcript audio response:', error);
        throw error;
    }
}

module.exports = { whisperTranscribe };
