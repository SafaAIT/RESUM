import React, { useState } from "react";

function InputForm({ setSummary, setAudioUrl, setChatEnabled, setArticles }) {
  const [selectedOption, setSelectedOption] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [rssInput, setRssInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [summaryLevel, setSummaryLevel] = useState("medium");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      choice: selectedOption,
      text_input: "",
      url_input: "",
      rss_input: "",
      file_data: null,
      file_name: null,
      summary_level: summaryLevel,
    };

    if (selectedOption === "text") body.text_input = textInput;
    else if (selectedOption === "url") body.url_input = urlInput;
    else if (selectedOption === "rss") body.rss_input = rssInput;

    if (selectedOption === "file" && fileInput) {
      const base64File = await toBase64(fileInput);
      body.file_data = base64File;
      body.file_name = fileInput.name;
    }

    try {
      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        if (data.articles) {
          setArticles(data.articles);
        } else if (data.summary) {
          setArticles([{ title: "Résumé", summary: data.summary }]);
        }

        if (data.audio_file) {
          setAudioUrl(`http://localhost:5000/audio`);
        }

        setChatEnabled(true);
      } else {
        setArticles([{ title: "Erreur", summary: "❌ Une erreur est survenue côté serveur." }]);
      }
    } catch (error) {
      console.error("Erreur de requête :", error);
      setArticles([{ title: "Erreur", summary: "❌ Une erreur est survenue lors de la soumission." }]);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Type d'entrée :</label>
        <div className="d-flex flex-wrap gap-3">
          {["text", "url", "file", "rss"].map((type) => (
            <div className="form-check form-check-inline" key={type}>
              <input
                className="form-check-input"
                type="radio"
                name="inputType"
                id={`input-${type}`}
                value={type}
                checked={selectedOption === type}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <label className="form-check-label" htmlFor={`input-${type}`}>
                {type.toUpperCase()}
              </label>
            </div>
          ))}
        </div>
      </div>

      {selectedOption === "text" && (
        <div className="mb-3">
          <label className="form-label">Texte à résumer</label>
          <textarea
            className="form-control"
            rows="5"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Collez votre texte ici..."
            required
          />
        </div>
      )}

      {selectedOption === "url" && (
        <div className="mb-3">
          <label className="form-label">URL</label>
          <input
            type="url"
            className="form-control"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Entrez une URL"
            required
          />
        </div>
      )}

      {selectedOption === "file" && (
        <div className="mb-3">
          <label className="form-label">Fichier</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFileInput(e.target.files[0])}
            required
          />
        </div>
      )}

      {selectedOption === "rss" && (
        <div className="mb-3">
          <label className="form-label">Flux RSS</label>
          <input
            type="url"
            className="form-control"
            value={rssInput}
            onChange={(e) => setRssInput(e.target.value)}
            placeholder="Entrez l'URL du flux RSS"
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Niveau de résumé</label>
        <select
          className="form-select"
          value={summaryLevel}
          onChange={(e) => setSummaryLevel(e.target.value)}
        >
          <option value="short">Court</option>
          <option value="medium">Moyen</option>
          <option value="long">Long</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        📤 Envoyer
      </button>
    </form>
  );
}

export default InputForm;
