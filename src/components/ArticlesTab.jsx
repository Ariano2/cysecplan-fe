const ArticlesTab = ({ articles, toArticle }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Articles</h2>
      {articles.length === 0 ? (
        <p className="text-gray-500">No articles available.</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div
              key={article._id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-gray-600">
                <span className="font-medium">Author:</span>{' '}
                {article.author?.firstName || 'Unknown'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Description:</span>{' '}
                {article.description}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Likes:</span>{' '}
                {article.activity?.total_likes || 0}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Reads:</span>{' '}
                {article.activity?.total_reads || 0}
              </p>
              <button
                className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                onClick={() => toArticle(article._id)}
              >
                Read Article
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesTab;
