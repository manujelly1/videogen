const OpenAI = require('openai');
const dotenv = require("dotenv");

dotenv.config();

async function chatGpt(user_prompt, system_prompt) {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    try {
        const chatCompletion = await client.chat.completions.create({
            messages: [
                {role: 'system', content: system_prompt},
                { role: 'user', content: user_prompt }
            ],
            model: process.env.OPENAI_MODEL,
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching chatgpt response:', error);
        throw error;
    }
}

module.exports = { chatGpt };
