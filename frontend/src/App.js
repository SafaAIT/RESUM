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
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold text-primary">📰 Veille Intelligente</h1>
          <p className="text-muted">Résumé automatique, audio & Q&A</p>
        </div>

        <div className="card p-4 mb-4 shadow-sm">
          <InputForm
            setAudioUrl={setAudioUrl}
            setChatEnabled={setChatEnabled}
            setArticles={setArticles}
          />
        </div>

        <SummarySection articles={articles} />

        <AudioPlayer audioUrl={audioUrl} />

        {chatEnabled && (
          <div className="card p-4 mt-4 shadow-sm">
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;