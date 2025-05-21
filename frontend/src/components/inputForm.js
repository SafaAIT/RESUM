import React, { useState } from "react";

function InputForm({ setSummary, setAudioUrl, setChatEnabled, setArticles }) {
  const [selectedOption, setSelectedOption] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [rssInput, setRssInput] = useState("");
  const [fileInput, setFileInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      choice: selectedOption,
      text_input: "",
      url_input: "",
      rss_input: "",
      file_data: null,
      file_name: null,
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
          setArticles(data.articles); // RSS : liste d'articles
        } else if (data.summary) {
          setArticles([{ title: "Résumé", summary: data.summary }]); // Texte / URL / Fichier
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
      <div>
        <label>
          <input
            type="radio"
            name="inputType"
            value="text"
            checked={selectedOption === "text"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Texte
        </label>
        <label>
          <input
            type="radio"
            name="inputType"
            value="url"
            checked={selectedOption === "url"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          URL
        </label>
        <label>
          <input
            type="radio"
            name="inputType"
            value="file"
            checked={selectedOption === "file"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Fichier
        </label>
        <label>
          <input
            type="radio"
            name="inputType"
            value="rss"
            checked={selectedOption === "rss"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Flux RSS
        </label>
      </div>

      {selectedOption === "text" && (
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows="6"
          cols="60"
          placeholder="Collez votre texte ici..."
          required
        />
      )}

      {selectedOption === "url" && (
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Entrez une URL"
          required
        />
      )}

      {selectedOption === "file" && (
        <input
          type="file"
          onChange={(e) => setFileInput(e.target.files[0])}
          required
        />
      )}

      {selectedOption === "rss" && (
        <input
          type="url"
          value={rssInput}
          onChange={(e) => setRssInput(e.target.value)}
          placeholder="Entrez l'URL du flux RSS"
          required
        />
      )}

      <br />
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default InputForm;
