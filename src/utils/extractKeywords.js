const OpenAI = require("openai");
const {chatGpt} = require("../api/chatgpt");

/**
 * Fonction pour extraire des mots-clés pertinents d'une histoire dans différentes langues.
 * @param {string} story - L'histoire générée.
 * @returns {Array<string>} - Liste de mots-clés.
 */
async function extractKeywordsFromStory(story) {
    const system_prompt = `You're a video research expert. The user will give you the segment of a video story they will make, and you will give back a list of couples of text search queries that will be used to search for background video footage.
  # Output format
  The format will be JSON parasable and look like this:
  ["French Revolution", "revolution France", "upheaval politics"]
  # Query search string list
  YOU ALWAYS USE ENGLISH IN YOUR TEXT QUERIES
  As you have seen above, for each time period you will be tasked to generate 3 strings that will be searched on the video search engine, to find the appropriate clip to find.
  Each string has to be between ONE to TWO words.
  Each search string must DEPICT something visual.
  The depictions have to be extremely visually concrete, like \`coffee beans\`, or \`dog running\`.
  'confused feelings' <= BAD, because it doesn't depict something visually
  'heartbroken man' <= GOOD, because it depicts something visual. 
  'man feeling very lonely' <= BAD, because it contains 4 words.
  The list must always contain 3 query searches.
  ['Sad person'] <= BAD, because it's one string
  ['Sad person', 'depressed man', 'depressed person'] <= GOOD, because it's 3 strings
  ['Une Pomme', 'un enfant qui rit', 'une personne heureuse'] <= BAD, because the text query is NOT in english`

    return chatGpt(story, system_prompt);
}

module.exports = { extractKeywordsFromStory };
