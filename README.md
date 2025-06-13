 ## Veille Automatisée avec Résumé, Audio, Chatbot
Ce projet est une application web complète (Full-Stack) permettant de :
- Résumer du texte, des fichiers PDF, des liens URL ou des flux RSS.
- Générer un fichier audio du résumé.
- Discuter avec un chatbot intelligent basé sur les contenus résumés.

---

##  Structure du projet

VEILLE/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── ai_models.py        # Modèles LLM, TTS, Traduction
│   │   ├── routes.py           # API Flask (process, chat, audio)
│   │   ├── testLLM.py
│   │   └── utils.py            # Fonctions de traitement
│   ├── audio/                  # Fichiers audio générés
│   ├── temp_uploads/           # Fichiers PDF temporaires
│   ├── requirements.txt        # Dépendances Python
│   └── run.py                  # Point d’entrée du backend
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── audioPlayer.js
│   │   │   ├── chatbot.js
│   │   │   ├── inputForm.js
│   │   │   └── summary.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles...
│   └── package.json
│
└── README.md


---

##  Installation

### Backend (Python)

bash
cd backend
python -m venv venv
# Sous Windows :
venv\Scripts\activate
# Sous Unix/Mac :
source venv/bin/activate
pip install -r requirements.txt
# Pour la traduction, installe également sentencepiece :
pip install sentencepiece


**Lancer le serveur Flask :**
bash
python run.py


###  Frontend (React)

bash
cd frontend
npm install
npm start


---

##  Fonctionnalités


 Traitement de texte brut, PDF, URL ou flux RSS.
 Résumé intelligent avec différents niveaux (court, moyen, long).
 Génération audio avec gTTS pour écouter les résumés.
 Chat contextuel (RAG) pour poser des questions sur le contenu analysé.

---

## Exemples d’utilisation

- **Fournir un lien vers un article** → Obtenir un résumé + audio + poser des questions au Chatbot par rapport a l'article
- **Charger un fichier PDF** → Résumé + questions possibles sur son contenu

---

##  Technologies

- **Frontend :** React.js
- **Backend :** Flask
- **LLM :** HuggingFace Transformers (CTransformers, BAAI/bge-base-en-v1.5)
- **Vector Store :** FAISS
- **Audio :** gTTS ou TTS

---

 Modèles LLM utilisés

1. Résumé automatique
- **Modèle :** facebook/bart-large-cnn
- **Librairie :** transformers

Ce modèle permet de générer automatiquement des résumés à partir de textes, fichiers PDF, URLs, etc.

 2. Chatbot avec RAG (Retrieval-Augmented Generation)
- **Modèle :** TheBloke/Llama-2-7B-Chat-GGUF
- **Librairie :** CTransformers via LangChain

Ce modèle permet de générer des réponses contextuelles et intelligentes à partir du contenu résumé (RAG).

---

##  Remerciements

Merci à la communauté open-source pour les outils et bibliothèques utilisés :  
[LangChain](https://github.com/langchain-ai/langchain), [HuggingFace](https://huggingface.co/), [FAISS](https://github.com/facebookresearch/faiss), [gTTS](https://github.com/pndurette/gTTS) et bien d’autres.
