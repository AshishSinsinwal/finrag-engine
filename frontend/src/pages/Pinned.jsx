import { Pin, ArrowUpRight, FileText, Sparkles, PinOff } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Pinned({ workspace }) {
  const { history, togglePin } = workspace;
  const navigate = useNavigate();

  const openWorkspaceDetail = (insightId) => {
    navigate(`/workspace/${insightId}`);
  };

  const pinnedInsights = history?.filter(item => item.isPinned) || [];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-full w-full py-12 px-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-app-text flex items-center gap-2 mb-2">
            <Pin className="w-6 h-6 text-app-warning fill-current" />
            Executive Insights
          </h1>
          <p className="text-app-text-secondary text-sm font-medium">
            Your pinned, highly-verified financial summaries.
          </p>
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-app-text-secondary bg-app-surface-secondary px-3 py-1.5 rounded-lg border border-app-border">
          {pinnedInsights.length} Reports Saved
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {pinnedInsights.length > 0 ? (
          pinnedInsights.map((insight) => (
            <motion.div
              key={insight._id}
              variants={item}
              className="group flex flex-col h-full bg-app-surface border border-app-border rounded-2xl p-6 shadow-premium hover:shadow-premium-hover hover:border-blue-200 transition-all duration-300 relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-app-text-secondary uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-app-accent" />
                  Gemini Synthesis
                </div>
                <span className="text-xs font-medium text-app-text-secondary">
                  {formatDate(insight.createdAt)}
                </span>
              </div>

              <h3 className="text-base font-semibold text-app-text tracking-tight leading-snug mb-3">
                {insight.queryText}
              </h3>
              <p className="text-sm text-app-text-secondary leading-relaxed font-medium flex-1 line-clamp-4">
                {insight.llmAnswer ? `"${insight.llmAnswer}"` : "Contexts retrieved, but no AI summary was generated."}
              </p>

              <div className="mt-6 pt-4 border-t border-app-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-app-text-secondary">
                  <FileText className="w-3.5 h-3.5" />
                  {insight.retrievedContexts?.length || 0} SEC Sources
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePin(insight._id, insight.isPinned)}
                    className="p-1.5 text-app-text-secondary hover:text-app-warning hover:bg-amber-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Unpin from workspace"
                  >
                    <PinOff className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openWorkspaceDetail(insight._id)}
                    className="flex items-center gap-1 text-sm font-semibold text-app-accent hover:text-app-accent-hover transition-colors"
                  >
                    View
                    <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-app-text-secondary text-sm">
            No pinned insights yet. Pin an insight from your workspace to see it here.
          </div>
        )}
      </motion.div>
    </div>
  );
}