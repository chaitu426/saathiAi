"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

export function YouTubeViewerModal({
  trigger,
  url,
}: {
  trigger: React.ReactNode;
  url: string; // must be a full YouTube URL
}) {
  // Convert YouTube URL to embed format
  function getEmbedUrl(videoUrl: string) {
    try {
      
      const id = url.split("/")[3]
      console.log(id)
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    } catch {
      return videoUrl;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-4xl w-full h-[70vh] p-0 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {/* Video Player */}
        <div className="w-full h-full bg-black">
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(url)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
