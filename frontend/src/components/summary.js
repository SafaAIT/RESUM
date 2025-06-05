import React from "react";

function SummarySection({ articles }) {
  if (!articles.length) return null;

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h4 className="mb-3">📝 Résumés</h4>
      {articles.map((article, index) => (
        <div key={index} className="mb-3 p-3 border rounded bg-white">
          <h5 className="text-primary">{article.title}</h5>
          <p>{article.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default SummarySection;
