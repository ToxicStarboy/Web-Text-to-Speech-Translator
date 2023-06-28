import React, { useState } from 'react';
import './App.css';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadIcon from '@mui/icons-material/Download';

const App = () => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLanguage: 'hi' }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslation(data.translation);

      // Generate audio file
      const audioResponse = await fetch('http://localhost:5000/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.translation }),
      });

      if (!audioResponse.ok) {
        throw new Error('Audio generation failed');
      }

      const audioBlob = await audioResponse.blob();
      setAudioBlob(audioBlob);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePlay = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text-to-speech.wav';
      a.click();
    }
  };

  return (
    <div className='container'>
      <h1>Text Translation and Text-to-Speech</h1>
      <label>Input your English Text here</label>
      <textarea value={text} onChange={handleTextChange} placeholder="Enter text"></textarea>
      <br />
      <button onClick={handleSubmit}>Translate to Hindi</button>
      <br />
      <p>{translation}</p>
      {audioBlob && (
        <div className='btn'>
          <button onClick={handlePlay}><PlayCircleIcon style={{ fontSize: 35 }}/>PLAY</button>
          <button onClick={handleDownload}><DownloadIcon style={{ fontSize: 35 }}/>DOWNLOAD</button>
        </div>
      )}
    </div>
  );
};

export default App;