import React, { useState } from "react";
import InputForm from "./components/inputForm";
import SummarySection from "./components/summary";
import AudioPlayer from "./components/audioPlayer";
import Chatbot from "./components/chatbot";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [chatEnabled, setChatEnabled] = useState(false);

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Veille</h1>
      <InputForm
        setAudioUrl={setAudioUrl}
        setChatEnabled={setChatEnabled}
        setArticles={setArticles}
      />
      <SummarySection articles={articles} />
      <AudioPlayer audioUrl={audioUrl} />
      {chatEnabled && <Chatbot />}
    </div>
  );
}

export default App;
