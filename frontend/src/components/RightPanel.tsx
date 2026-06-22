import React, { useState } from "react";
import StringData from "../StringData";

export interface Chunk {
  id: number;
  source: string;
  score: number;
  text: string;
  page: string;
}

type PanelTab = "sources" | "pipeline" | "sql" | "vector";

interface PipelineStep {
  label: string;
  status: "done" | "active" | "idle";
}

interface RightPanelProps {
  chunks: Chunk[];
  highlightedChunk: number | null;
  onChunkClick: (idx: number) => void;
}

const pipelineSteps: PipelineStep[] = StringData.pipeline.steps.map(
  (label: string, i: number) => ({
    label,
    status: (i < 6 ? "done" : i === 6 ? "active" : "idle") as PipelineStep["status"],
  })
);

const TabButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 text-[11px] text-center border-b-2 transition-colors ${
      active
        ? "text-[#00C9FF] border-[#00C9FF]"
        : "text-[#4A6070] border-transparent hover:text-[#5A8099]"
    }`}
  >
    {label}
  </button>
);

const SourcesPanel: React.FC<{
  chunks: Chunk[];
  highlightedChunk: number | null;
  onChunkClick: (idx: number) => void;
}> = ({ chunks, highlightedChunk, onChunkClick }) => (
  <div className="flex flex-col overflow-hidden flex-1">
    <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#1B2D40]">
      <span className="text-[11px] font-medium text-[#5A8099]">
        {StringData.rightPanel.sourcesHeader}
      </span>
      <span className="bg-[#0F2535] rounded-full px-2 py-0.5 text-[10px] text-[#00C9FF]">
        {StringData.rightPanel.chunkCountBadge.replace(
          "{count}",
          String(chunks.length)
        )}
      </span>
    </div>
    <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2">
      {chunks.map((chunk, idx) => (
        <button
          key={chunk.id}
          onClick={() => onChunkClick(idx)}
          className={`w-full text-left rounded-lg p-2.5 border transition-colors ${
            highlightedChunk === idx
              ? "border-[#00C9FF] bg-[#091822]"
              : "border-[#1B2D40] bg-[#0D1B2A] hover:border-[#00C9FF]"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#00C9A7] font-medium">{chunk.source}</span>
            <span className="text-[10px] bg-[#0A2030] text-[#00C9FF] px-1.5 py-0.5 rounded">
              {chunk.score.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-[#6A8099] leading-snug line-clamp-3">{chunk.text}</p>
          <p className="text-[10px] text-[#3A5060] mt-1.5">{chunk.page}</p>
        </button>
      ))}
    </div>
  </div>
);

const PipelinePanel: React.FC = () => (
  <div className="flex-1 overflow-y-auto p-3">
    <p className="text-[10px] text-[#3A5060] uppercase tracking-wider mb-2">
      {StringData.pipeline.lastQueryLabel}
    </p>
    {pipelineSteps.map((step) => (
      <div key={step.label} className="flex items-center gap-1.5 text-[10px] text-[#5A8099] py-0.5">
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            step.status === "done"
              ? "bg-[#00C9A7]"
              : step.status === "active"
              ? "bg-[#00C9FF] animate-pulse"
              : "bg-[#1B2D40]"
          }`}
        />
        {step.label}
      </div>
    ))}

    <div className="mt-4 pt-3 border-t border-[#1B2D40]">
      <p className="text-[10px] text-[#3A5060] uppercase tracking-wider mb-2">
        {StringData.rightPanel.pipelineConfigHeader}
      </p>
      {(Object.entries(StringData.pipeline.configKeys) as [string, string][]).map(([key, label]) => (
        <div key={key} className="flex justify-between text-[11px] text-[#5A8099] mb-1">
          <span>{label}</span>
          <span className="text-[#C8D8E8]">
            {StringData.pipeline.configValues[key as keyof typeof StringData.pipeline.configValues]}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SQLPanel: React.FC = () => (
  <div className="flex-1 overflow-y-auto p-3">
    <p className="text-[10px] text-[#3A5060] uppercase tracking-wider mb-2">
      {StringData.sqlTool.schemaLabel}
    </p>
    <div className="space-y-2">
      {[
        {
          name: "document_chunks",
          cols: ["id uuid", "doc_id text", "chunk_index int", "embedding vector(1536)", "content text", "metadata jsonb"],
        },
        {
          name: "documents",
          cols: ["id uuid", "name text", "size_bytes int", "chunk_count int", "status text"],
        },
      ].map((table) => (
        <div key={table.name}>
          <div className="bg-[#0F2535] border border-[#00C9FF] rounded px-2 py-1 text-[10px] text-[#00C9FF] font-medium mb-1">
            ▶ {table.name}
          </div>
          {table.cols.map((col) => (
            <p key={col} className="text-[10px] text-[#5A8099] pl-3 leading-5">
              {col}
            </p>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const VectorPanel: React.FC = () => (
  <div className="flex-1 overflow-y-auto p-3">
    <p className="text-[10px] text-[#3A5060] uppercase tracking-wider mb-2">
      {StringData.vectorTool.configLabel}
    </p>
    {(Object.entries(StringData.vectorTool.configKeys) as [string, string][]).map(([key, label]) => (
      <div key={key} className="flex justify-between text-[11px] text-[#5A8099] mb-1">
        <span>{label}</span>
        <span className="text-[#C8D8E8] font-medium">
          {StringData.vectorTool.configValues[key as keyof typeof StringData.vectorTool.configValues]}
        </span>
      </div>
    ))}
    <div className="mt-3 pt-3 border-t border-[#1B2D40]">
      <p className="text-[10px] text-[#3A5060] uppercase tracking-wider mb-2">
        {StringData.vectorTool.statsLabel}
      </p>
      <div className="flex justify-between text-[11px] text-[#5A8099] mb-1">
        <span>{StringData.vectorTool.statsKeys.totalVectors}</span>
        <span className="text-[#00C9FF] font-semibold">{StringData.vectorTool.statsValues.totalVectors}</span>
      </div>
      <div className="flex justify-between text-[11px] text-[#5A8099] mb-1">
        <span>{StringData.vectorTool.statsKeys.indexSize}</span>
        <span className="text-[#C8D8E8]">{StringData.vectorTool.statsValues.indexSize}</span>
      </div>
      <div className="flex justify-between text-[11px] text-[#5A8099]">
        <span>{StringData.vectorTool.statsKeys.avgQueryTime}</span>
        <span className="text-[#00C9A7]">{StringData.vectorTool.statsValues.avgQueryTime}</span>
      </div>
    </div>
  </div>
);

const RightPanel: React.FC<RightPanelProps> = ({
  chunks,
  highlightedChunk,
  onChunkClick,
}) => {
  const [activeTab, setActiveTab] = useState<PanelTab>("sources");

  return (
    <div className="w-[260px] min-w-[260px] bg-[#0A1520] border-l border-[#1B2D40] flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#1B2D40]">
        {(
          [
            ["sources", StringData.rightPanel.tabSources],
            ["pipeline", StringData.rightPanel.tabPipeline],
            ["sql", StringData.rightPanel.tabSQL],
            ["vector", StringData.rightPanel.tabVector],
          ] as [PanelTab, string][]
        ).map(([tab, label]) => (
          <TabButton
            key={tab}
            label={label}
            active={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>

      {activeTab === "sources" && (
        <SourcesPanel
          chunks={chunks}
          highlightedChunk={highlightedChunk}
          onChunkClick={onChunkClick}
        />
      )}
      {activeTab === "pipeline" && <PipelinePanel />}
      {activeTab === "sql" && <SQLPanel />}
      {activeTab === "vector" && <VectorPanel />}
    </div>
  );
};

export default RightPanel;
