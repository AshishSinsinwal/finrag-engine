import { useState } from "react";
import { FileText, Table, Hash, BookOpen, LayoutList, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

const STATIC_PDF_URL = "/apple-10k.pdf";

function ContextCard({ ctx, index, itemVariants }) {
  const [viewMode, setViewMode] = useState("document");

  const getPreviewText = (context) => {
    if (context.type === "table") {
      return context.content || "";
    }
    return context.chunk || context.context || "";
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group bg-app-surface border border-app-border p-5 rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {ctx.type === "table" ? (
              <Table className="w-4 h-4 text-green-600" />
            ) : (
              <BookOpen className="w-4 h-4 text-purple-600" />
            )}
            <span className="text-xs font-bold uppercase tracking-wide text-app-text">
              {ctx.type}
            </span>
          </div>
          <span className="text-sm font-semibold text-app-text">
            {ctx.section}
          </span>
          {ctx.page && (
            <span className="text-xs text-app-text-secondary flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Page {ctx.page}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center bg-app-bg border border-app-border rounded-lg p-1 w-fit mb-3">
        <button
          onClick={() => setViewMode("extracted")}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "extracted"
              ? "bg-white text-app-text shadow-sm border border-app-border/50"
              : "text-app-text-secondary hover:text-app-text hover:bg-black/5"
          }`}
        >
          <LayoutList className="w-3.5 h-3.5" />
          Extracted Data
        </button>
        <button
          onClick={() => setViewMode("document")}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            viewMode === "document"
              ? "bg-white text-app-text shadow-sm border border-app-border/50"
              : "text-app-text-secondary hover:text-app-text hover:bg-black/5"
          }`}
        >
          <FileSearch className="w-3.5 h-3.5" />
          Original Document
        </button>
      </div>

      <div className="flex-1 relative">
        {viewMode === "extracted" ? (
          <div className="bg-app-bg rounded-xl p-4 border border-app-border/50 max-h-[400px] overflow-y-auto no-scrollbar">
            <p className="text-sm text-app-text-secondary leading-relaxed whitespace-pre-wrap font-mono text-[13px]">
              {getPreviewText(ctx)?.slice(0, 1200)}
              {getPreviewText(ctx)?.length > 1200 && "..."}
            </p>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl border border-app-border/50 h-[400px] overflow-hidden relative">
            {ctx.page ? (
              <iframe
                src={`${STATIC_PDF_URL}#page=${ctx.page}&view=FitH`}
                className="w-full h-full border-0"
                title={`Original Source Page ${ctx.page}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-app-text-secondary text-sm">
                No exact page number available for this context.
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ContextGrid({ contexts = [], route }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-semibold tracking-tight text-app-text flex items-center gap-2">
          <FileText className="w-4 h-4 text-app-text-secondary" />
          Retrieved Evidence
        </h2>
        <div className="flex items-center gap-2">
          {route && (
            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                route === "table"
                  ? "bg-green-50 text-green-700"
                  : "bg-purple-50 text-purple-700"
              }`}
            >
              {route}
            </span>
          )}
          <span className="text-xs font-medium text-app-text-secondary bg-app-border/50 px-2 py-0.5 rounded-md">
            {contexts.length} Sources
          </span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 overflow-y-auto no-scrollbar pb-8"
      >
        {contexts.map((ctx, index) => (
          <ContextCard
            key={`${ctx.section}-${index}`}
            ctx={ctx}
            index={index}
            itemVariants={itemVariants}
          />
        ))}
      </motion.div>
    </div>
  );
}