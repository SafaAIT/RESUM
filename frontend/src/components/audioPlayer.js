function AudioPlayer({ audioUrl }) {
  return audioUrl ? (
    <div className="card mt-4 shadow-sm p-3">
      <h4 className="mb-3">🔊 Audio du résumé</h4>
      <audio controls className="w-100">
        <source src={audioUrl} type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio HTML5.
      </audio>
    </div>
  ) : null;
}

export default AudioPlayer;
