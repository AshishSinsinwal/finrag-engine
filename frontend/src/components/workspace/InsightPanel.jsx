import {
  Sparkles,
  Copy,
  Pin,
  ShieldCheck,
  Database,
  FileText,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function InsightPanel({
  status,
  record,
  onGenerate,
  onPin
}) {
  if (status === "contexts_ready") {
    return (
      <div className="h-full bg-app-surface border border-app-border rounded-2xl shadow-premium p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-blue-50 text-app-accent rounded-xl flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-app-text mb-2">
          Evidence Retrieved
        </h3>
        <p className="text-sm text-app-text-secondary max-w-sm mb-6">
          {record?.retrievedContexts?.length || 0} sources have been retrieved and verified.
          Generate an AI answer grounded exclusively in filing evidence.
        </p>
        <button
          onClick={onGenerate}
          className="bg-app-text text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generate AI Insight
        </button>
      </div>
    );
  }

  if (status === "generating") {
    return (
      <div className="h-full bg-app-surface border border-app-border rounded-2xl shadow-premium p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-5 h-5 rounded-full border-2 border-app-accent border-t-transparent animate-spin"></div>
          <span className="text-sm font-medium tracking-tight text-app-text">
            Compiling grounded answer...
          </span>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-app-border/40 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-app-border/40 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-app-border/40 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-full bg-red-50/30 border border-red-100 rounded-2xl shadow-premium p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-red-900 mb-2">
          AI Models at Capacity
        </h3>
        <p className="text-sm text-red-700 max-w-md mb-6">
          Our free-tier AI service is currently experiencing high demand and we've temporarily hit our API limits. Please wait a few moments and try again.
        </p>
        <button
          onClick={onGenerate}
          className="bg-white border border-red-200 text-red-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full bg-app-surface border border-app-border rounded-2xl shadow-premium p-8 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-app-border/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-app-accent" />
            <h2 className="text-base font-semibold tracking-tight text-app-text">
              AI Analysis
            </h2>
          </div>
          <p className="text-xs text-app-text-secondary">
            {record?.query}
          </p>
        </div>
        <div className="flex items-center gap-1 text-app-success bg-green-50 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {record?.route && (
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
              record.route === "table"
                ? "bg-green-50 text-green-700"
                : "bg-purple-50 text-purple-700"
            }`}
          >
            {record.route}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-app-text-secondary">
          <Database className="w-3 h-3" />
          {record?.sources?.length || 0} Sources Used
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="bg-app-bg border border-app-border rounded-xl p-5">
          <p className="text-app-text font-medium text-[15px] leading-relaxed whitespace-pre-wrap">
            {record?.answer || record?.llmAnswer || "No answer generated."}
          </p>
        </div>

        {record?.sources?.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-app-text-secondary mb-3">
              Sources
            </h3>
            <div className="space-y-2">
              {record.sources.map((source, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-app-bg border border-app-border rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-app-text-secondary" />
                    <span className="text-sm font-medium">
                      {source.section}
                    </span>
                  </div>
                  {source.page && (
                    <span className="text-xs text-app-text-secondary">
                      Page {source.page}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-app-border/50 flex items-center justify-between">
        <p className="text-[11px] font-medium text-app-text-secondary uppercase tracking-widest">
          Gemini 2.5 Flash
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                record?.answer || record?.llmAnswer || ""
              )
            }
            className="p-2 text-app-text-secondary hover:text-app-text hover:bg-app-bg rounded-lg transition-colors"
            title="Copy Answer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onPin}
            className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-sm transition-all ${
              record?.isPinned
                ? "bg-amber-50 text-app-warning border-amber-200"
                : "bg-app-bg border-app-border text-app-text hover:border-gray-300"
            }`}
          >
            <Pin
              className={`w-3.5 h-3.5 ${record?.isPinned ? "fill-current" : ""}`}
            />
            {record?.isPinned ? "Pinned" : "Pin to Workspace"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}