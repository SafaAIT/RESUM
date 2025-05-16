function AudioPlayer({ audioUrl }) {
  return audioUrl ? (
    <div>
      <h3>Audio du résumé</h3>
      <audio controls>
        <source src={audioUrl} type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio HTML5.
      </audio>
    </div>
  ) : null;
}

export default AudioPlayer;
