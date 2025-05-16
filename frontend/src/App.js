import React, { useState } from "react";
import InputForm from "./components/inputForm";
import SummarySection from "./components/summary";
import AudioPlayer from "./components/audioPlayer";
import Chatbot from "./components/chatbot";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [summary, setSummary] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [chatEnabled, setChatEnabled] = useState(false);

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>📰 Résumé + 💬 Chatbot + 🔊 Audio</h1>
      <InputForm setSummary={setSummary} setAudioUrl={setAudioUrl} setChatEnabled={setChatEnabled} />
      <SummarySection summary={summary} />
      <AudioPlayer audioUrl={audioUrl} />
      {chatEnabled && <Chatbot />}
    </div>
  );
}

export default App;
