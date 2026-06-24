import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export default function QueryInput({
  query,
  setQuery,
  onSubmit,
  status
}) {
  const loading = status === "searching" || status === "generating";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query?.trim()) return;
    onSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    "What was Apple's total net sales in 2025?",
    "What cybersecurity risks did Apple discuss?",
    "What was Apple's operating income in 2025?",
    "How much revenue came from Services in 2025?",
    "What risks did Apple identify in Item 1A?"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 mb-6 transition-shadow focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Apple's SEC filing..."
              rows={2}
              disabled={loading}
              className="w-full bg-transparent outline-none resize-none text-slate-900 placeholder:text-slate-400 text-base"
            />
          </div>
          <div className="flex justify-end items-center pt-2">
            <button
              type="submit"
              disabled={loading || !query?.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-full font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => setQuery(suggestion)}
            disabled={loading}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}