import React from "react";

export default function SummarySection({ summary }) {
  if (!summary) return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Résumé :</h2>
      <p>{summary}</p>
    </div>
  );
}
