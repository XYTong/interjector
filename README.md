# Interjector

Interjector is a web application designed to enhance your communication experience. This tool offers a unique blend of features that can translate, summarize, and process your speech to provide a more comprehensive and engaging interaction. 

## Features

1. **Transcription**: Interjector generates a transcript of your speech from your microphone. 

2. **Translation & Summarization**: This feature can be particularly helpful when dealing with foreign languages or lengthy dialogues. 

3. **Completion with GPT**: Interjector can process the transcript using GPT models. This allows for potential insights, suggestions, or even jokes to be generated based on the context of the conversation.

## Potential Use Cases

1. **Language Learning**: Interjector can help you pick up new words and phrases in a foreign language. It can also assist in understanding and constructing sentences in a new language.

2. **Dialog Enhancement**: While listening to a dialog, such as during an interview or discussion, Interjector provides additional information to enrich your understanding of the topic.

3. **Humour Generation**: Interjector can generate related jokes based on the context of your conversation, helping you talk with humour and making your interactions more enjoyable.

## Getting Started

To get started with Interjector, you will need to host the application which requires both a frontend and backend setup. Basically:

1. Clone this repository.
1. Install the dependencies via `npm install`.
1. Run `npm run build`.
1. Enter the `./dist` directory and run `node server.js`.

You will need to configure it according to the next chapter.

## Configuration

When the server is running, go to `./settings.html` to fill in the configuration such as the API for translation and GPT, and the prompts.

- Use BCP 47 language tag for the source language and target language. The source language is also used for speech recognition.
- Translation backend includes 'free-google-translate', 'google-translate' (not implemented yet), 'bing-translate'(not implemented yet), 'deepl-translate'(not implemented yet), 'openai-translate'. When using 'openai-translate', you need to provide the model and prompt.
- For completion, you need to fill an API key and URL which follows OpenAI's API style. You also need to provide a prompt for the completion.
- [Prompt Examples](./docs/prompt-examples.md) are provided to help you get started.

## Screenshot

Screenshot demonstrating interjector generating response while listening to an interview:

![Screenshot demonstrating interjector generating response while listening to an interview](https://raw.githubusercontent.com/simonmysun/interjector/master/docs/screenshots/1.png)


## TODO

1. The current implementation of speech recognition is based on Web Speech API. As of 2024-05-20 This API is not supported by most browsers and Chrome can almost only recognize English. We need to implement a more robust solution that works across more browsers and supports more languages.
1. More translation API
1. More prompts

## License
See [LICENSE](LICENSE).

