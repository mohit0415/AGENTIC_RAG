import React from "react";
import StringData from "../StringData";

export type DocStatus = "ready" | "indexing";
export type DocType = "pdf" | "doc" | "txt" | "md";

export interface Document {
  id: string;
  name: string;
  meta: string;
  type: DocType;
  status: DocStatus;
}

interface SidebarProps {
  documents: Document[];
  activeDocId: string | null;
  stats: { chunks: string; docs: number; accuracy: string };
  onDocSelect: (id: string) => void;
  onUploadClick: () => void;
}

const iconStyles: Record<DocType, string> = {
  pdf: "bg-[#2D1015] text-[#FF6B6B]",
  doc: "bg-[#0D1F35] text-[#4FC3F7]",
  txt: "bg-[#1A2010] text-[#81C784]",
  md:  "bg-[#1A1030] text-[#CE93D8]",
};

const iconLabels: Record<DocType, string> = {
  pdf: "PDF",
  doc: "DOC",
  txt: "TXT",
  md:  "MD",
};

const Sidebar: React.FC<SidebarProps> = ({
  documents,
  activeDocId,
  stats,
  onDocSelect,
  onUploadClick,
}) => {
  return (
    <aside
      className="w-[220px] min-w-[220px] bg-[#0A1520] border-r border-[#1B2D40] flex flex-col"
      aria-label={StringData.aria.sidebar}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1B2D40]">
        <div className="w-7 h-7 bg-[#00C9FF] rounded-md flex items-center justify-center text-[#0D1B2A] text-sm font-semibold">
          {StringData.app.logoEmoji}
        </div>
        <span className="font-semibold text-[15px] text-[#F0F4F8] font-sans">
          Doc<span className="text-[#00C9FF]">{StringData.app.nameHighlight}</span>
        </span>
      </div>

      {/* Section label */}
      <p className="text-[10px] font-medium tracking-widest text-[#4A6070] uppercase px-3.5 pt-3.5 pb-1.5">
        {StringData.nav.sectionDocuments}
      </p>

      {/* Upload button */}
      <button
        onClick={onUploadClick}
        aria-label={StringData.aria.uploadButton}
        className="mx-2.5 mb-2 px-3 py-2 border border-dashed border-[#1B4060] rounded-lg text-[#00C9FF] text-xs text-center bg-transparent hover:bg-[#0F2535] transition-colors"
      >
        ↑ {StringData.nav.uploadBtn}
      </button>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onDocSelect(doc.id)}
            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors text-left ${
              activeDocId === doc.id
                ? "bg-[#122033] border-l-2 border-[#00C9FF] pl-1.5"
                : "hover:bg-[#1B2D40]"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-[5px] flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${iconStyles[doc.type]}`}
            >
              {iconLabels[doc.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#C8D8E8] truncate">{doc.name}</p>
              <p className="text-[10px] text-[#4A6070] mt-0.5">{doc.meta}</p>
            </div>
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                doc.status === "ready" ? "bg-[#00C9A7]" : "bg-[#FFB74D]"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="border-t border-[#1B2D40] px-3 py-3">
        <div className="flex justify-between">
          {[
            { val: stats.chunks, lbl: StringData.nav.statChunks },
            { val: String(stats.docs), lbl: StringData.nav.statDocs },
            { val: stats.accuracy, lbl: StringData.nav.statAccuracy },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="text-center">
              <p className="text-base font-semibold text-[#00C9FF]">{val}</p>
              <p className="text-[10px] text-[#4A6070]">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
