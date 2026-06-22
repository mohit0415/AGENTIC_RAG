import React, { useState } from "react";
import Sidebar, { Document } from "../components/Sidebar";
import ChatArea, { Message } from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import RightPanel, { Chunk } from "../components/RightPanel";
import TopBar from "../components/TopBar";
import StringData from "../StringData";

const INITIAL_DOCS: Document[] = [
  { id: "1", name: "LangChain_Docs.pdf",    meta: "2.4 MB · 847 chunks",  type: "pdf", status: "ready"    },
  { id: "2", name: "RAG_Architecture.docx", meta: "1.1 MB · 312 chunks",  type: "doc", status: "ready"    },
  { id: "3", name: "pgvector_guide.txt",    meta: "Indexing... 68%",       type: "txt", status: "indexing" },
];

const INITIAL_CHUNKS: Chunk[] = [
  { id: 0, source: "LangChain_Docs.pdf",    score: 0.94, text: "Naive RAG retrieves the top-k documents using cosine similarity against the query embedding, without any post-retrieval filtering or re-ranking step...", page: "Page 14 · chunk #234" },
  { id: 1, source: "RAG_Architecture.docx", score: 0.91, text: "Cross-encoder re-rankers score query-document pairs jointly, offering dramatically better relevance judgments compared to bi-encoder similarity alone...", page: "Page 3 · chunk #48"  },
  { id: 2, source: "LangChain_Docs.pdf",    score: 0.88, text: "HyDE (Hypothetical Document Embeddings) generates a hypothetical answer to the query, embeds it, and uses that embedding for retrieval...",           page: "Page 22 · chunk #301" },
  { id: 3, source: "RAG_Architecture.docx", score: 0.82, text: "Multi-query retrieval generates multiple reformulations of the original question to increase recall from the vector store...",                           page: "Page 5 · chunk #61"  },
  { id: 4, source: "LangChain_Docs.pdf",    score: 0.79, text: "The contextual compression retriever applies a document compressor to extracted chunks before returning them to reduce noise in the context window...",  page: "Page 18 · chunk #267" },
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "ai",
  content: StringData.chat.welcomeMessage
    .replace("{count}", "3")
    .replace("{chunks}", "1,159"),
};

const ChatPage: React.FC = () => {
  const [documents, setDocuments]           = useState<Document[]>(INITIAL_DOCS);
  const [activeDocId, setActiveDocId]       = useState<string | null>("1");
  const [messages, setMessages]             = useState<Message[]>([WELCOME_MESSAGE]);
  const [isThinking, setIsThinking]         = useState(false);
  const [highlightedChunk, setHighlighted]  = useState<number | null>(0);

  const stats = {
    chunks: "1.2k",
    docs: documents.length,
    accuracy: "96%",
  };

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Placeholder — real API call goes here
    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content:
          "Based on the indexed documents, here is what I found. [API integration coming soon]",
        citations: [],
        sources: [],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1800);
  };

  const handleUpload = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: "new_document.md",
      meta: "Indexing... 0%",
      type: "md",
      status: "indexing",
    };
    setDocuments((prev) => [...prev, newDoc]);

    let pct = 0;
    const timer = setInterval(() => {
      pct += Math.floor(Math.random() * 15) + 5;
      if (pct >= 100) {
        clearInterval(timer);
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id
              ? { ...d, meta: "0.8 MB · 189 chunks", status: "ready" }
              : d
          )
        );
      } else {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id ? { ...d, meta: `Indexing... ${pct}%` } : d
          )
        );
      }
    }, 400);
  };

  return (
    <div className="flex h-screen bg-[#0D1B2A] text-[#F0F4F8] font-sans overflow-hidden">
      <Sidebar
        documents={documents}
        activeDocId={activeDocId}
        stats={stats}
        onDocSelect={setActiveDocId}
        onUploadClick={handleUpload}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <ChatArea
          messages={messages}
          isThinking={isThinking}
          onCitationClick={setHighlighted}
          onSourceChipClick={setHighlighted}
        />
        <ChatInput
          docCount={documents.length}
          onSend={handleSend}
          disabled={isThinking}
        />
      </main>

      <RightPanel
        chunks={INITIAL_CHUNKS}
        highlightedChunk={highlightedChunk}
        onChunkClick={setHighlighted}
      />
    </div>
  );
};

export default ChatPage;
