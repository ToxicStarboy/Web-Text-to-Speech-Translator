const express = require('express');
const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate').v2;
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const cors = require('cors');
require('dotenv').config();

const translate = new Translate();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const gtts = new TextToSpeechClient();

app.post('/speech', async (req, res) => {
  try {
    const { text } = req.body;

    const request = {
      input: { text },
      voice: { languageCode: 'hi-IN', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await gtts.synthesizeSpeech(request);

    const audioContent = response.audioContent;
    res.set('Content-Type', 'audio/mp3');
    res.send(audioContent);
  } catch (error) {
    console.error('Text-to-speech conversion error:', error);
    res.status(500).json({ error: 'Text-to-speech conversion failed' });
  }
});

app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    const [translation] = await translate.translate(text, targetLanguage);

    res.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
