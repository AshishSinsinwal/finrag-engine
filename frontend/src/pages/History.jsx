import {
  Clock,
  Search,
  Trash2,
  Pin,
  ChevronRight,
  Sparkles,
  Database
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function History({ workspace }) {
  const {
    history,
    togglePin,
    deleteRecord,
    setCurrentRecord,
    setStatus,
    fetchHistory,
  } = workspace;

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: {
      opacity: 0,
      x: -10
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const openRecord = (record) => {
    navigate(`/workspace/${record._id}`);
  };

  return (
    <div className="min-h-full w-full py-12 px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-app-text flex items-center gap-2 mb-2">
          <Clock className="w-6 h-6 text-app-text-secondary" />
          Workspace History
        </h1>
        <p className="text-app-text-secondary text-sm font-medium">
          SEC filing retrieval history, evidence logs, and AI generated insights.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {history && history.length > 0 ? (
          history.map((record) => (
            <motion.div
              key={record._id}
              variants={item}
              className="group flex items-center justify-between p-4 bg-app-surface border border-app-border rounded-xl shadow-sm hover:shadow-premium transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-app-surface-secondary flex items-center justify-center text-app-text-secondary border border-app-border/50">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-app-text tracking-tight mb-1">
                    {record.queryText}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-app-text-secondary font-medium">
                    <span>{formatDate(record.createdAt)}</span>
                    {record.route && (
                      <span
                        className={`px-1.5 py-0.5 rounded uppercase tracking-wider text-[10px] font-bold ${
                          record.route === "table"
                            ? "bg-green-50 text-green-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {record.route}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      {record.retrievedContexts?.length || 0} Sources
                    </span>
                    {record.llmAnswer && (
                      <span className="flex items-center gap-1 text-app-accent bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider text-[10px] font-bold">
                        <Sparkles className="w-3 h-3" />
                        AI Summary
                      </span>
                    )}
                    {record.isPinned && (
                      <span className="flex items-center gap-1 text-app-warning bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider text-[10px] font-bold">
                        <Pin className="w-3 h-3 fill-current" />
                        Pinned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => deleteRecord(record._id)}
                  className="p-2 text-app-text-secondary hover:text-app-danger hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => togglePin(record._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    record.isPinned
                      ? "text-app-warning bg-amber-50"
                      : "text-app-text-secondary hover:text-app-text hover:bg-app-bg"
                  }`}
                  title={record.isPinned ? "Unpin" : "Pin to workspace"}
                >
                  <Pin
                    className={`w-4 h-4 ${record.isPinned ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={() => openRecord(record)}
                  className="ml-2 flex items-center gap-1 px-3 py-1.5 bg-app-text text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors shadow-sm"
                >
                  Open
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-app-text-secondary text-sm">
            No workspace history found.
            <br />
            Execute a SEC filing query to begin.
          </div>
        )}
      </motion.div>
    </div>
  );
}