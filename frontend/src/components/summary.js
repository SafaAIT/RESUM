export default function SummarySection({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-5 px-4 py-4">
      <h2 className="text-xl font-semibold mb-4">Résumé :</h2>
      {articles.map((article, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-4"
        >
          {article.title !== "Résumé" && (
            <h3 className="text-lg font-bold mb-2">{article.title}</h3>
          )}
          <p className="whitespace-pre-wrap text-gray-700">{article.summary}</p>
        </div>
      ))}
    </div>
  );
}
