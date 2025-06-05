import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const res = await axios.post("http://localhost:5000/chat", { question: userInput });

    setMessages([...messages, { user: userInput, bot: res.data.answer }]);
    setUserInput("");
  };

  return (
    <div>
      <h4 className="mb-3">🤖 Posez vos questions</h4>
      <div className="mb-3" style={{ maxHeight: 300, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            <div className="text-end">
              <span className="badge bg-primary">Vous</span>
              <div className="alert alert-primary d-inline-block">{m.user}</div>
            </div>
            <div>
              <span className="badge bg-secondary">Bot</span>
              <div className="alert alert-secondary d-inline-block">{m.bot}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={userInput}
          placeholder="Posez une question..."
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
