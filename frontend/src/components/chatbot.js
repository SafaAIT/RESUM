import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const handleSend = async () => {
    const res = await axios.post("http://localhost:5000/chat", { question: userInput });

    setMessages([...messages, { user: userInput, bot: res.data.answer }]);
    setUserInput("");
  };

  return (
    <div>
      <h2>Posez vos questions</h2>
      <div style={{ marginBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>Vous:</b> {m.user} <br />
            <b>Bot:</b> {m.bot}
            <hr />
          </div>
        ))}
      </div>
      <input value={userInput} onChange={(e) => setUserInput(e.target.value)} />
      <button onClick={handleSend}>Envoyer</button>
    </div>
  );
}

export default Chatbot;
