import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search } from "lucide-react";
import QueryInput from "../components/workspace/QueryInput";
import ContextGrid from "../components/workspace/ContextGrid";
import InsightPanel from "../components/workspace/InsightPanel";

export default function Home({ workspace }) {
  const [query, setQuery] = useState("");

  const {
    status,
    currentRecord,
    executeSearch,
    executeSummarize,
    togglePin
  } = workspace;

  const handleSearch = () => {
    executeSearch(query);
  };

  const handleGenerateAI = () => {
    executeSummarize();
  };

  return (
    <div className="min-h-full w-full py-12 px-8 flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -40,
              filter: "blur(10px)"
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="text-center mt-20 mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-app-accent text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Enterprise RAG Active
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-app-text mb-4">
              FinRAG Intelligence Engine
            </h1>
            <p className="text-lg text-app-text-secondary max-w-2xl mx-auto font-medium">
              Retrieve exact figures, analyze SEC filings, and generate executive insights with grounded evidence.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{
          duration: 0.5,
          ease: [0.25, 1, 0.5, 1]
        }}
        className="w-full flex-shrink-0"
        style={{
          marginTop: status !== "idle" ? "20px" : "0px",
          marginBottom: status !== "idle" ? "40px" : "0px",
          maxWidth: "64rem"
        }}
      >
        <QueryInput
          query={query}
          setQuery={setQuery}
          onSubmit={handleSearch}
          status={status}
        />
      </motion.div>

      <AnimatePresence>
        {status !== "idle" && status !== "searching" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl flex flex-col gap-12"
          >
            <div className="flex flex-col gap-6 w-full">
              <section className="w-full">
                <div className="bg-white border border-app-border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-app-text-secondary">
                    <Search className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Target Query
                    </h3>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-app-text">
                    {currentRecord?.query}
                  </h2>
                </div>
              </section>

              <section className="w-full">
                <InsightPanel
                  status={status}
                  record={currentRecord}
                  query={currentRecord?.query}
                  route={currentRecord?.route}
                  answer={currentRecord?.answer}
                  sources={currentRecord?.sources || []}
                  onGenerate={handleGenerateAI}
                  onPin={() => {
                    if (currentRecord?._id) {
                      togglePin(currentRecord._id);
                    }
                  }}
                />
              </section>
            </div>

            <section className="w-full">
              <div className="flex items-center gap-2 mb-6 text-app-text">
                <Database className="w-5 h-5 text-app-text-secondary" />
                <h2 className="text-xl font-semibold tracking-tight">
                  Retrieved Evidence
                </h2>
              </div>
              <ContextGrid
                contexts={currentRecord?.retrievedContexts || []}
                route={currentRecord?.route}
              />
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}