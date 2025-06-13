Veille Automatisée avec Résumé, Audio, Chatbot
Cette application web Full-Stack permet de :

Résumer du texte, des fichiers PDF, des liens URL ou des flux RSS.

Générer un fichier audio à partir du résumé.

Offrir une interface conversationnelle interactive basée sur les contenus traités.

Structure du projet
csharp
Copier
Modifier
VEILLE/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── processing.py       # Modules de traitement automatique
│   │   ├── routes.py           # API Flask (résumé, chat, audio)
│   │   ├── analyse.py
│   │   └── utils.py            # Fonctions utilitaires
│   ├── audio/                  # Fichiers audio générés
│   ├── temp_uploads/           # Fichiers PDF temporaires
│   ├── requirements.txt        # Dépendances Python
│   └── run.py                  # Lancement du serveur
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
Installation
Backend (Python)
bash
Copier
Modifier
cd backend
python -m venv venv
# Sous Windows :
venv\Scripts\activate
# Sous Unix/Mac :
source venv/bin/activate
pip install -r requirements.txt
pip install sentencepiece
Lancer le serveur :

bash
Copier
Modifier
python run.py
Frontend (React)
bash
Copier
Modifier
cd frontend
npm install
npm start
Fonctionnalités
Analyse de texte, PDF, URL ou flux RSS.

Résumé multi-niveaux : court, moyen, long.

Génération audio pour écoute des résumés.

Interface de questions-réponses personnalisée sur les contenus analysés.

Exemples d’utilisation
Fournir un lien vers un article → Obtenir un résumé, une version audio, et poser des questions sur le contenu.

Charger un fichier PDF → Résumé interactif et consultation ciblée du contenu.

Technologies
Frontend : React.js

Backend : Flask

Traitement de contenu : Pipelines de résumé et recherche contextuelle

Stockage vectoriel : FAISS

Audio : gTTS ou TTS

Mécanismes de traitement
Résumé automatique
Outils de condensation de texte adaptés à divers formats (texte brut, documents, pages web...).

Interface conversationnelle
Recherche contextuelle permettant de poser des questions ciblées avec des réponses en lien direct avec le contenu analysé.

Remerciements
Merci aux nombreuses bibliothèques open-source utilisées dans ce projet :
LangChain, HuggingFace, FAISS, gTTS, SentencePiece, entre autres.
