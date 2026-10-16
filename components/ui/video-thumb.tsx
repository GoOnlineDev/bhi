"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import SmartImage from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

/**
 * Poster tile for a video. Uses the admin-provided thumbnail when there is one;
 * otherwise grabs a frame from the video itself, over a branded gradient so the
 * tile is never a blank grey box while (or if) the frame fails to load.
 */
export default function VideoThumb({
  src,
  thumbnail,
  title,
  className,
  sizes,
}: {
  src: string;
  thumbnail?: string | null;
  title?: string;
  className?: string;
  sizes?: string;
}) {
  const [frameReady, setFrameReady] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-primary/80 to-[#7a3a0c]", className)}>
      {thumbnail ? (
        <SmartImage src={thumbnail} alt={title ?? "Video thumbnail"} wrapperClassName="absolute inset-0" sizes={sizes} />
      ) : (
        <video
          src={`${src}#t=0.5`}
          className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-500", frameReady ? "opacity-100" : "opacity-0")}
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setFrameReady(true)}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
          <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
        </span>
      </div>
    </div>
  );
}
