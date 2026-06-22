import React, { useRef, useEffect } from "react";
import StringData from "../StringData";

export interface Citation {
  chunkIndex: number;
  label: string;
}

export interface SourceChip {
  chunkIndex: number;
  label: string;
  icon: string;
}

export interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  citations?: Citation[];
  sources?: SourceChip[];
}

interface ChatAreaProps {
  messages: Message[];
  isThinking: boolean;
  thinkingLabel?: string;
  onCitationClick: (chunkIndex: number) => void;
  onSourceChipClick: (chunkIndex: number) => void;
}

const TypingIndicator: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex gap-2.5">
    <Avatar role="ai" />
    <div className="flex items-center gap-2 text-[#4A6070] text-xs py-1">
      <div className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#00C9FF] opacity-40 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <span>{label}</span>
    </div>
  </div>
);

const Avatar: React.FC<{ role: "ai" | "user" }> = ({ role }) => (
  <div
    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
      role === "ai"
        ? "bg-[#00C9FF] text-[#0D1B2A]"
        : "bg-[#1B2D40] text-[#8899A6]"
    }`}
  >
    {role === "ai" ? "D" : "M"}
  </div>
);

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isThinking,
  thinkingLabel,
  onCitationClick,
  onSourceChipClick,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <div
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5"
      aria-label={StringData.aria.chatArea}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-2.5 max-w-full ${msg.role === "user" ? "flex-row-reverse" : ""}`}
        >
          <Avatar role={msg.role} />
          <div
            className={`rounded-[10px] px-3.5 py-2.5 max-w-[75%] leading-relaxed text-[12.5px] border ${
              msg.role === "ai"
                ? "bg-[#122033] border-[#1B2D40] text-[#C8D8E8]"
                : "bg-[#0F2535] border-[#1B4060] text-[#E0ECFA]"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>

            {/* Inline citation badges */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {msg.citations.map((c) => (
                  <button
                    key={c.chunkIndex}
                    onClick={() => onCitationClick(c.chunkIndex)}
                    className="inline-block bg-[#0A2030] border border-[#005080] rounded text-[10px] px-1.5 py-0.5 text-[#00C9FF] cursor-pointer hover:bg-[#0F3550] transition-colors"
                  >
                    [{c.label}]
                  </button>
                ))}
              </div>
            )}

            {/* Source chips */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#1B2D40]">
                {msg.sources.map((s) => (
                  <button
                    key={s.chunkIndex}
                    onClick={() => onSourceChipClick(s.chunkIndex)}
                    className="flex items-center gap-1 bg-[#0A1A28] border border-[#1B3048] rounded-md text-[10px] px-2 py-0.5 text-[#5A8099] hover:border-[#00C9FF] hover:text-[#00C9FF] transition-colors"
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {isThinking && (
        <TypingIndicator
          label={
            thinkingLabel ||
            StringData.chat.thinkingLabel.replace("{count}", "5")
          }
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatArea;
