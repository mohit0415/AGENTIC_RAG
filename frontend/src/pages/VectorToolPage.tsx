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

const CLUSTERS = [
  { cx: "25%", cy: "30%", color: "#00C9FF", label: "LangChain cluster",    dots: 8 },
  { cx: "55%", cy: "55%", color: "#FF6B6B", label: "Architecture cluster", dots: 6 },
  { cx: "72%", cy: "25%", color: "#00C9A7", label: "pgvector cluster",     dots: 7 },
  { cx: "40%", cy: "65%", color: "#FFB74D", label: "Query vector",         dots: 1 },
];

const VectorToolPage: React.FC = () => {
  const [query, setQuery]          = useState("");
  const [topK, setTopK]            = useState(5);
  const [activeDocId, setActive]   = useState<string | null>("1");
  const [highlighted, setHL]       = useState<number | null>(null);

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
          title={StringData.vectorTool.pageTitle}
          subtitle={StringData.vectorTool.pageTitleSuffix}
          modelName={StringData.vectorTool.dbBadge}
        />

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Search bar */}
          <div>
            <p className="text-[10px] text-[#4A6070] uppercase tracking-wider mb-2">
              {StringData.vectorTool.searchLabel}
            </p>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={StringData.vectorTool.searchPlaceholder}
                className="flex-1 bg-[#0A1520] border border-[#1B2D40] rounded-lg px-3 py-2 text-[12px] text-[#F0F4F8] placeholder-[#3A5060] outline-none focus:border-[#00C9FF] transition-colors"
              />
              <div className="flex items-center gap-1 bg-[#0F2535] border border-[#1B2D40] rounded-lg px-3 py-2 text-[11px] text-[#C8D8E8]">
                <span className="text-[#5A8099]">{StringData.vectorTool.topKLabel}</span>
                <input
                  type="number"
                  value={topK}
                  min={1}
                  max={20}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-8 bg-transparent text-[#C8D8E8] text-center outline-none"
                />
              </div>
              <button className="bg-[#00C9FF] text-[#0D1B2A] text-[11px] font-semibold px-4 py-2 rounded-lg hover:bg-[#33D4FF] transition-colors">
                {StringData.vectorTool.searchBtn}
              </button>
            </div>
          </div>

          {/* Embedding space visualization */}
          <div>
            <p className="text-[10px] text-[#4A6070] uppercase tracking-wider mb-2">
              {StringData.vectorTool.vizLabel}
            </p>
            <div className="relative bg-[#0A1520] border border-[#1B2D40] rounded-lg overflow-hidden" style={{ height: "280px" }}>
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                {[...Array(10)].map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#00C9FF" strokeWidth="1" />
                    <line x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#00C9FF" strokeWidth="1" />
                  </React.Fragment>
                ))}
              </svg>

              {/* Cluster dots */}
              {CLUSTERS.map((cl) => (
                <div key={cl.label} className="absolute" style={{ left: cl.cx, top: cl.cy }}>
                  {/* Satellite dots */}
                  {[...Array(cl.dots)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full opacity-50"
                      style={{
                        width: 6, height: 6,
                        backgroundColor: cl.color,
                        left: Math.sin(i * (360 / cl.dots) * (Math.PI / 180)) * 24,
                        top:  Math.cos(i * (360 / cl.dots) * (Math.PI / 180)) * 18,
                      }}
                    />
                  ))}
                  {/* Center dot */}
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: cl.color, borderColor: cl.color }}
                  />
                  <p className="text-[9px] mt-1 whitespace-nowrap" style={{ color: cl.color }}>
                    {cl.label}
                  </p>
                </div>
              ))}
            </div>
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

export default VectorToolPage;
