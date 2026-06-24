import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Database, Search, Clock, Layers } from "lucide-react";
import ContextGrid from "../components/workspace/ContextGrid";
import InsightPanel from "../components/workspace/InsightPanel";

export default function WorkspaceDetail({ workspace }) {
  const { id } = useParams();
  const {
    getRecordById,
    executeSummarize,
    togglePin,
    setCurrentRecord
  } = workspace;

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  async function loadWorkspace() {
    try {
      setLoading(true);
      const data = await getRecordById(id);
      setRecord(data);
      if (setCurrentRecord) {
        setCurrentRecord({
          queryId: data._id,
          query: data.queryText,
          route: data.route,
          retrievedContexts: data.retrievedContexts || [],
          answer: data.llmAnswer,
          sources: data.sources || []
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGenerate = async () => {
    if (executeSummarize) {
      await executeSummarize();
      loadWorkspace();
    }
  };

  const handlePin = async () => {
    if (togglePin && record) {
      await togglePin(record._id);
      setRecord(prev => ({ ...prev, isPinned: !prev.isPinned }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-app-text-secondary">
        Loading workspace...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex items-center justify-center h-64 text-app-text-secondary">
        Workspace not found.
      </div>
    );
  }

  const panelStatus = record.llmAnswer ? "complete" : "contexts_ready";

  return (
    <div className="max-w-5xl mx-auto py-10 px-8 flex flex-col gap-8">
      <section className="w-full">
        <div className="bg-white border border-app-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-app-text-secondary">
            <Search className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Target Query
            </h3>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-app-text mb-4">
            {record.queryText}
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-app-bg border border-app-border/50 text-[11px] font-semibold text-app-text-secondary uppercase">
              <Layers className="w-3 h-3" />
              Route: {record.route}
            </span>
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-app-bg border border-app-border/50 text-[11px] font-semibold text-app-text-secondary uppercase">
              <Clock className="w-3 h-3" />
              {new Date(record.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="w-full">
        <InsightPanel
          status={panelStatus}
          record={{
            query: record.queryText,
            route: record.route,
            answer: record.llmAnswer,
            sources: record.sources,
            isPinned: record.isPinned,
            retrievedContexts: record.retrievedContexts
          }}
          onGenerate={handleGenerate}
          onPin={handlePin}
        />
      </section>

      <section className="w-full mt-4">
        <div className="flex items-center gap-3 mb-6 text-app-text">
          <div className="w-8 h-8 rounded-lg bg-app-surface border border-app-border flex items-center justify-center shadow-sm">
            <Database className="w-4 h-4 text-app-text-secondary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Retrieved Evidence
          </h2>
        </div>
        <ContextGrid
          contexts={record.retrievedContexts}
          route={record.route}
        />
      </section>
    </div>
  );
}