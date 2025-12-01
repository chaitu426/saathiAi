"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Document, Page } from "react-pdf";

export function ViewerModal({
  trigger,
  url,
  type,
}: {
  trigger: React.ReactNode;
  url: string;
  type: "pdf" | "image";
}) {
  const [scale, setScale] = useState(1);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-300 hover:text-white"
              onClick={() => setScale((s) => s + 0.1)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-300 hover:text-white"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-zinc-300 hover:text-white"
              onClick={() => window.open(url, "_blank")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          
        </div>

        {/* Viewer Area */}
        <div className="w-full h-full overflow-auto bg-neutral-950 flex items-center justify-center p-4">
          {type === "image" ? (
            <img
              src={url}
              style={{ transform: `scale(${scale})` }}
              className="max-w-full max-h-full rounded-lg"
            />
          ) : (
            <Document file={url} className="flex flex-col items-center">
              <Page pageNumber={1} scale={scale} renderAnnotationLayer={false} />
            </Document>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
