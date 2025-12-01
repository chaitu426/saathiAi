"use client";

import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Document, Page } from "react-pdf";
import { useState } from "react";
import { ChatInterface } from "../chat/ChatInterface";

export function SplitViewer({
  type,
  url,
  onClose,
}: {
  type: "pdf" | "image" | "youtube";
  url: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);

  const renderContent = () => {
    if (type === "image")
      return (
        <img
          src={url}
          className="max-w-full max-h-full object-contain"
          style={{ transform: `scale(${scale})` }}
        />
      );

    if (type === "pdf")
      return (
        <Document file={url} className="flex flex-col items-center">
          <Page
            pageNumber={1}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      );

    if (type === "youtube")
      return (
        <iframe
          src={`https://www.youtube.com/embed/${url}`}
          className="w-full h-full rounded-lg"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );

    return null;
  };

  return (
    <div className="flex h-full w-full">
      {/* Left Panel: Viewer */}
      <div className="w-1/2 border-r border-neutral-800 p-4 bg-neutral-950 flex flex-col">
        {/* Controls */}
        <div className="flex justify-between items-center mb-3">
          <div className="space-x-2">
            <button
              onClick={() => setScale((s) => s + 0.1)}
              className="px-3 py-1 bg-neutral-800 rounded"
            >
              <ZoomIn />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
              className="px-3 py-1 bg-neutral-800 rounded"
            >
              <ZoomOut />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded text-red-400"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center">
          {renderContent()}
        </div>
      </div>

      {/* Right Panel: Chat */}
      <div className="w-1/2 p-4 overflow-hidden">
        <ChatInterfaceEmbedded />
      </div>
    </div>
  );
}

// Reuse your existing ChatInterface
function ChatInterfaceEmbedded() {
  return <ChatInterface frameId="viewer-mode" />;
}
