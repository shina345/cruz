"use client";

import { useEffect, useRef } from "react";

interface SafeVideoProps {
  src: string;
  className?: string;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  opacity?: number;
}

export default function SafeVideo({
  src,
  className = "",
  loop = true,
  muted = true,
  playsInline = true,
}: SafeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isSubscribed = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isSubscribed) {
              video.pause();
            }
          })
          .catch((error) => {
            // Gracefully catch browser autoplay or unmount-driven play/pause interruptions
            console.log("SafeVideo autoplay handled safely:", error.message);
          });
      }
    };

    // Attempt playback when component is mounted and metadata is loaded
    attemptPlay();

    return () => {
      isSubscribed = false;
      try {
        video.pause();
      } catch (err) {
        // Suppress any errors when pausing during unmount
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
