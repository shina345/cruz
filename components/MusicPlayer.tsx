"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ── Master playlist pointing to local downloaded M4A files ───────────────────
const PLAYLIST = [
  { title: "Mavo - Mofe", url: "/music/track_0.m4a" },
  { title: "Mavo - Escaladizzy II (feat. Ayra Starr, Shallipopi, Zlatan)", url: "/music/track_1.m4a" },
  { title: "Burna Boy - On The Low", url: "/music/track_2.m4a" },
  { title: "Burna Boy, Seyi Vibez - Giza", url: "/music/track_3.m4a" },
  { title: "Asake - Forgiveness", url: "/music/track_4.m4a" },
  { title: "Asake, DJ Snake - WORSHIP", url: "/music/track_5.m4a" },
  { title: "Asake - 2:30", url: "/music/track_6.m4a" },
  { title: "Asake - I Believe", url: "/music/track_7.m4a" },
  { title: "SPINALL, Asake - PALAZZO", url: "/music/track_8.m4a" },
  { title: "Asake, Burna Boy - Sungba (Remix)", url: "/music/track_9.m4a" },
  { title: "Dave, Tems - Raindance", url: "/music/track_10.m4a" },
  { title: "Wizkid, Tems - Essence", url: "/music/track_11.m4a" },
  { title: "Future, Drake, Tems - WAIT FOR U", url: "/music/track_12.m4a" },
  { title: "Davido, Musa Keys - UNAVAILABLE", url: "/music/track_13.m4a" },
  { title: "Olamide - Synchro System", url: "/music/track_14.m4a" },
  { title: "Wizkid, Asake - Jogodo", url: "/music/track_15.m4a" },
  { title: "Gunna, Wizkid - forever be mine", url: "/music/track_16.m4a" },
  { title: "Seyi Vibez - Karma", url: "/music/track_17.m4a" },
  { title: "Seyi Vibez - Pressure", url: "/music/track_18.m4a" },
  { title: "Ayra Starr, Seyi Vibez - Bad Vibes", url: "/music/track_19.m4a" },
];

export default function MusicPlayer() {
  const [isMounted, setIsMounted]     = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted]         = useState(false);
  const [isShuffled, setIsShuffled]   = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hydration guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe play helper to handle async promise play interrupts
  const playAudio = useCallback(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Local audio playback interrupted or blocked:", error);
        });
      }
    }
  }, []);

  // Monitor changes in current track and playing status
  useEffect(() => {
    if (!isMounted || !audioRef.current) return;

    // Set src if it differs
    const targetSrc = PLAYLIST[currentTrack].url;
    if (!audioRef.current.src.endsWith(targetSrc)) {
      audioRef.current.src = targetSrc;
    }

    if (isPlaying) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlaying, isMounted, playAudio]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (isShuffled) {
      let next = Math.floor(Math.random() * PLAYLIST.length);
      // Avoid playing same track twice consecutively if playlist has multiple items
      if (PLAYLIST.length > 1) {
        while (next === currentTrack) {
          next = Math.floor(Math.random() * PLAYLIST.length);
        }
      }
      setCurrentTrack(next);
    } else {
      setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
    }
  }, [isShuffled, currentTrack]);

  const handlePrev = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  }, []);

  const handleEnded = useCallback(() => {
    handleNext();
  }, [handleNext]);

  // Gracefully skip to the next track if the current file has an error (e.g. still downloading)
  const handleError = useCallback((err: any) => {
    console.warn(`Local file error for track index ${currentTrack}, skipping to next track...`, err);
    // Add small delay to avoid rapid looping in case of multiple issues
    setTimeout(() => {
      handleNext();
    }, 1500);
  }, [currentTrack, handleNext]);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-2 w-64 bg-cruzBg/95 backdrop-blur-md p-3 border border-cruzBorder shadow-2xl rounded-lg transition-all duration-300 opacity-60 hover:opacity-100">
      
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onError={handleError}
        preload="auto"
      />

      {/* Track info */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="text-[10px] font-medium tracking-[0.15em] uppercase text-cruzBlack truncate">
          {PLAYLIST[currentTrack].title}
        </div>
        <div className="text-[8px] tracking-[0.2em] text-cruzBlack/60 uppercase">LOCAL PLAYBACK</div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t border-cruzBorder/40 pt-2 mt-1">

        {/* ── Play/Pause/Prev/Next ── */}
        <div className="flex items-center gap-3">
          <button onClick={handlePrev} title="Previous" className="hover:text-cruzGold transition-colors text-cruzBlack">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-cruzBlack text-cruzBg hover:bg-cruzGold hover:text-cruzBlack transition-all"
          >
            {isPlaying ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[0.5px]">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </button>

          <button onClick={handleNext} title="Next" className="hover:text-cruzGold transition-colors text-cruzBlack">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

         {/* ── Toggles ── */}
        <div className="flex items-center gap-2">

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
            className={`hover:text-cruzGold transition-colors ${isMuted ? "text-red-500" : "text-cruzBlack"}`}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>

          {/* Shuffle toggle */}
          <button
            onClick={toggleShuffle}
            title="Shuffle"
            className={`hover:text-cruzGold transition-colors ${isShuffled ? "text-cruzGold" : "text-cruzBlack/40"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h5l-1 6" />
              <path d="M20 20h-5l1-6" />
              <path d="M2 14h2c2 0 4-8 6-8h2c2 0 3 8 5 8h2" />
              <path d="M22 10h-2c-2 0-4 8-6 8h-2c-2 0-3-8-5-8h-2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
