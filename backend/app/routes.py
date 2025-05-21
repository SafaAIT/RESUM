from flask import Blueprint, request, jsonify, send_file
import os
import base64
from app.utils import process_input, rag_chain

routes = Blueprint("routes", __name__)

@routes.route("/process", methods=["POST"])
def process():
    try:
        data = request.get_json()
        choice = data.get("choice")
        text_input = data.get("text_input", "")
        url_input = data.get("url_input", "")
        rss_input = data.get("rss_input", "")
        file_data = data.get("file_data")
        file_name = data.get("file_name")

        file_path = None
        if choice == "file" and file_data and file_name:
            # Décoder le base64
            header, encoded = file_data.split(",", 1)
            file_bytes = base64.b64decode(encoded)

            # Sauvegarder temporairement le fichier
            temp_dir = "temp_uploads"
            os.makedirs(temp_dir, exist_ok=True)
            file_path = os.path.join(temp_dir, file_name)
            with open(file_path, "wb") as f:
                f.write(file_bytes)

        summary, rag, content, audio_path = process_input(
            choice=choice,
            text_input=text_input,
            file_path=file_path,
            url_input=url_input,
            rss_input=rss_input
        )

        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        response = {
            "status": "success",
            "summary": summary,
            "audio_file": audio_path
        }

        return jsonify(response)  

    except Exception as e:
        print(f"Erreur dans /process : {e}")
        return jsonify({"error": str(e), "status": "error"}), 500


@routes.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    print("Données reçues dans /chat :", data)  # Ajoute ce log

    question = data.get("question")
    if not rag_chain:
        return jsonify({"error": "No context loaded. Please process a document first."}), 400

    try:
        response = rag_chain.run(question)
        return jsonify({"answer": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route("/audio", methods=["GET"])
def download_audio():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    audio_path = os.path.join(base_dir, "audio", "summary_audio.mp3")

    if not os.path.exists(audio_path):
        return jsonify({"error": "Audio file not found"}), 404

    return send_file(audio_path, mimetype="audio/mpeg", as_attachment=False)
