
import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="group relative w-full">
      {children}
      <div className="absolute bottom-full left-1/2 z-20 mb-3 w-64 -translate-x-1/2 transform rounded-lg bg-slate-700 px-3 py-2 text-center text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100 scale-0">
        <span className="absolute -bottom-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-slate-700"></span>
        {content}
      </div>
    </div>
  );
};
