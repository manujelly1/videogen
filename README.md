
# StoryVideoGenerator

**StoryVideoGenerator** is an NPM module that transforms a textual prompt into a complete video story. It utilizes AI for generating narratives, fetches relevant video clips, generates synthesized audio, and adds subtitles, producing a final, polished video.

## Features

- **AI-Powered Story Generation**: Create engaging stories from user-provided prompts.
- **Keyword Extraction**: Identify key phrases from the story to guide video content selection.
- **Video Retrieval**: Fetch relevant video clips from Pexels.
- **Text-to-Speech**: Generate audio narration using Google Text-to-Speech.
- **Subtitle Integration**: Automatically generate and embed subtitles.
- **Final Video Composition**: Assemble video segments, audio, and subtitles into a cohesive final product.

## Installation

Install the module via npm:

```bash
npm install videogen
```

First create a .env file or ````bash cp .env.example .env ````

## Usage

```javascript
const {videogen} = require("videogen/src");
videogen({prompt: "Football and his history", hasSubtitle: true, orientation: "portrait"})
    .then(res => console.log(res)) //res is a final computed video path
    .catch(err => console.error(err))
```

## Configuration

### Pexels API Key
To fetch video content, you need a Pexels API key. You can obtain it by signing up on the [Pexels API](https://www.pexels.com/api/) website.

### Google Text-to-Speech
To generate audio, you need Google Cloud Text-to-Speech credentials. Follow the [Google Cloud setup instructions](https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries) to obtain your credentials.


## Contributing

We welcome contributions! Please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Pexels for providing free video content.
- Google Cloud for the Text-to-Speech API.
- OpenAI for GPT-based story generation.

## Support

For any issues or questions, please open an issue on the GitHub repository.

Enjoy creating story-based videos!
