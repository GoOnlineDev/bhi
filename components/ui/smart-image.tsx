"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Local and https images go through the Next optimiser; anything else (http:, data:) is passed through. */
function canOptimize(src: string): boolean {
  return src.startsWith("/") || src.startsWith("https://");
}

type SmartImageProps = Omit<ImageProps, "src" | "fill"> & {
  src?: string | null;
  /** Wrapper classes (sizing / aspect ratio). The image always fills the wrapper. */
  wrapperClassName?: string;
  /** "cover" crops to fill (default); "contain" shows the whole image (posters, flyers). */
  fit?: "cover" | "contain";
  fallbackLabel?: string;
};

/**
 * Image with a shimmer skeleton while loading, a branded fallback when there is no
 * image or it fails, correct `sizes`, and optimisation where the host allows it.
 * Pass `priority` for above-the-fold images.
 */
export default function SmartImage({
  src,
  alt,
  wrapperClassName,
  className,
  fit = "cover",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  fallbackLabel,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div className={cn("relative overflow-hidden bg-muted", wrapperClassName)}>
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-secondary">
          <Image
            src="/BOOST HEALTH PNG LOGO ICON Bckg TRANS.png"
            alt=""
            width={48}
            height={48}
            className="opacity-40"
          />
          {fallbackLabel ? <span className="text-xs text-muted-foreground px-2 text-center line-clamp-1">{fallbackLabel}</span> : null}
        </div>
      ) : (
        <>
          {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />}
          {fit === "contain" && (
            // Blurred backdrop so posters don't leave empty bars
            <Image src={src} alt="" aria-hidden fill sizes={sizes} unoptimized={!canOptimize(src)}
              className="object-cover blur-2xl scale-110 opacity-40" />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            unoptimized={!canOptimize(src)}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn(
              fit === "contain" ? "object-contain" : "object-cover",
              "transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
              className,
            )}
            {...rest}
          />
        </>
      )}
    </div>
  );
}
