import React from "react";
import StringData from "../StringData";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  modelName?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  title = StringData.chat.title,
  subtitle = StringData.chat.titleSuffix,
  modelName = StringData.chat.modelBadge,
}) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1B2D40]">
    <p className="font-medium text-sm text-[#8899A6]">
      <strong className="text-[#F0F4F8]">{title}</strong>
      {subtitle ? ` · ${subtitle}` : ""}
    </p>
    <div className="flex items-center gap-1 bg-[#0F2535] border border-[#1B4060] rounded-full px-2.5 py-0.5 text-[11px] text-[#00C9FF]">
      <span>⊞</span>
      <span>{modelName}</span>
    </div>
  </div>
);

export default TopBar;
