import React from 'react';
import { Bot } from 'lucide-react';

export default function AvatarPreview({ seed }) {
  return (
    <div className="rounded-full w-28 h-28 bg-gradient-to-br from-gray-700 to-black flex items-center justify-center border-4 border-lime-400">
      <Bot size={40} className="text-white" title={`Avatar: ${seed}`} />
    </div>
  );
}
