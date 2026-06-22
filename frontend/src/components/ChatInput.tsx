import React, { useState, useRef } from "react";
import StringData from "../StringData";

interface ChatInputProps {
  docCount: number;
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ docCount, onSend, disabled }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end px-4 py-3 border-t border-[#1B2D40]">
      <div className="flex-1 flex items-center gap-2 bg-[#0A1520] border border-[#1B2D40] rounded-[10px] px-3 py-2 focus-within:border-[#00C9FF] transition-colors">
        <span className="bg-[#0D2030] border border-[#1B3048] rounded text-[10px] text-[#5A8099] px-1.5 py-0.5 whitespace-nowrap">
          {StringData.chat.scopeBadge.replace("{count}", String(docCount))}
        </span>
        <textarea
          ref={inputRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={StringData.chat.inputPlaceholder}
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-[12.5px] text-[#F0F4F8] placeholder-[#3A5060] resize-none h-5 leading-5 font-sans"
        />
      </div>
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label={StringData.aria.sendButton}
        className="w-9 h-9 bg-[#00C9FF] rounded-[9px] flex items-center justify-center text-[#0D1B2A] text-base flex-shrink-0 hover:bg-[#33D4FF] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ↑
      </button>
    </div>
  );
};

export default ChatInput;
