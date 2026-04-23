"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const savedMuted = localStorage.getItem("app-music-muted");
    const muted = savedMuted === "true";

    setIsMuted(muted);

    if (audioRef.current) {
      audioRef.current.muted = muted;
      audioRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;
    localStorage.setItem("app-music-muted", String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    const tryStartMusic = async () => {
      if (!audioRef.current || hasStarted) return;

      try {
        await audioRef.current.play();
        setHasStarted(true);
      } catch {
        // Le navigateur a bloqué l’autoplay avec son.
      }
    };

    tryStartMusic();
  }, [hasStarted]);

  useEffect(() => {
    const startOnFirstInteraction = async () => {
      if (!audioRef.current || hasStarted) return;

      try {
        await audioRef.current.play();
        setHasStarted(true);
      } catch {
        // Rien, on réessaiera à la prochaine interaction
      }
    };

    window.addEventListener("click", startOnFirstInteraction);
    window.addEventListener("touchstart", startOnFirstInteraction);

    return () => {
      window.removeEventListener("click", startOnFirstInteraction);
      window.removeEventListener("touchstart", startOnFirstInteraction);
    };
  }, [hasStarted]);

  function toggleMute() {
    setIsMuted((prev) => !prev);
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/One_piece__epic.mp3" loop />

      <button
        type="button"
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-[9999] rounded-full border border-green-500/40 bg-black/80 px-4 py-3 text-sm font-bold text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.25)] backdrop-blur-sm"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </>
  );
}