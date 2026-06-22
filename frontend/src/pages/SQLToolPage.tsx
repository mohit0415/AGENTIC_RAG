import React, { useState } from "react";
import Sidebar, { Document } from "../components/Sidebar";
import RightPanel, { Chunk } from "../components/RightPanel";
import TopBar from "../components/TopBar";
import StringData from "../StringData";

const DOCS: Document[] = [
  { id: "1", name: "LangChain_Docs.pdf",    meta: "2.4 MB · 847 chunks", type: "pdf", status: "ready" },
  { id: "2", name: "RAG_Architecture.docx", meta: "1.1 MB · 312 chunks", type: "doc", status: "ready" },
  { id: "3", name: "pgvector_guide.txt",    meta: "Indexing... 68%",      type: "txt", status: "indexing" },
];

const CHUNKS: Chunk[] = [
  { id: 0, source: "LangChain_Docs.pdf",    score: 0.94, text: "Naive RAG retrieves the top-k documents...", page: "Page 14 · chunk #234" },
  { id: 1, source: "RAG_Architecture.docx", score: 0.91, text: "Cross-encoder re-rankers score...",          page: "Page 3 · chunk #48"  },
];

const MOCK_RESULTS = [
  { doc_id: "langchain_docs",   chunk: "234", similarity: "0.94", page: "14", preview: "Naive RAG retrieves top-k docs..." },
  { doc_id: "rag_architecture", chunk: "48",  similarity: "0.91", page: "3",  preview: "Cross-encoder re-rankers score..."  },
  { doc_id: "langchain_docs",   chunk: "301", similarity: "0.88", page: "22", preview: "HyDE generates a hypothetical..."   },
];

const SQLToolPage: React.FC = () => {
  const [query, setQuery]         = useState(StringData.sqlTool.defaultQuery);
  const [results, setResults]     = useState<typeof MOCK_RESULTS>([]);
  const [ran, setRan]             = useState(false);
  const [activeDocId, setActive]  = useState<string | null>("1");
  const [highlighted, setHL]      = useState<number | null>(null);

  const handleRun = () => {
    setResults(MOCK_RESULTS);
    setRan(true);
  };

  return (
    <div className="flex h-screen bg-[#0D1B2A] text-[#F0F4F8] font-sans overflow-hidden">
      <Sidebar
        documents={DOCS}
        activeDocId={activeDocId}
        stats={{ chunks: "1.2k", docs: DOCS.length, accuracy: "96%" }}
        onDocSelect={setActive}
        onUploadClick={() => {}}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={StringData.sqlTool.pageTitle}
          subtitle={StringData.sqlTool.pageTitleSuffix}
          modelName={StringData.sqlTool.dbBadge}
        />

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* SQL Editor */}
          <div className="rounded-lg border border-[#1B2D40] overflow-hidden">
            <div className="flex items-center justify-between bg-[#0A1520] px-3 py-2 border-b border-[#1B2D40]">
              <span className="text-[11px] text-[#5A8099] uppercase tracking-wider">SQL Editor</span>
              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 bg-[#00C9FF] text-[#0D1B2A] text-[11px] font-semibold px-3 py-1 rounded-lg hover:bg-[#33D4FF] transition-colors"
              >
                {StringData.sqlTool.runBtn}
              </button>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck={false}
              className="w-full bg-[#0A1520] text-[#C8D8E8] text-[12px] font-mono p-4 resize-none outline-none leading-relaxed"
              style={{ minHeight: "180px" }}
            />
          </div>

          {/* Results */}
          <div>
            <p className="text-[10px] text-[#4A6070] uppercase tracking-wider mb-2">
              {StringData.sqlTool.resultsLabel}
            </p>
            {!ran ? (
              <p className="text-[12px] text-[#3A5060] text-center py-8">
                {StringData.sqlTool.noResults}
              </p>
            ) : (
              <div className="rounded-lg border border-[#1B2D40] overflow-hidden">
                {/* Header */}
                <div className="grid bg-[#0F2535] px-3 py-2" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                  {StringData.sqlTool.tableHeaders.map((h: string) => (
                    <span key={h} className="text-[9px] font-medium text-[#00C9FF] uppercase tracking-wider">
                      {h}
                    </span>
                  ))}
                </div>
                {results.map((row, i) => (
                  <div
                    key={i}
                    className={`grid px-3 py-2 text-[11px] ${i % 2 === 0 ? "bg-[#091822]" : "bg-transparent"}`}
                    style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                  >
                    <span className="text-[#5A8099]">{row.doc_id}</span>
                    <span className="text-[#C8D8E8]">{row.chunk}</span>
                    <span className="text-[#00C9A7]">{row.similarity}</span>
                    <span className="text-[#C8D8E8]">{row.page}</span>
                    <span className="text-[#5A8099] truncate">{row.preview}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <RightPanel
        chunks={CHUNKS}
        highlightedChunk={highlighted}
        onChunkClick={setHL}
      />
    </div>
  );
};

export default SQLToolPage;
