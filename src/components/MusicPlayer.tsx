"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MUSIC_BY_ACTIVITY: Record<string, string> = {
  Muscu: "/audio/MuscuSong.mp3",
  Jogging: "/audio/MuscuSong.mp3",
  Vélo: "/audio/MuscuSong.mp3",
  Yoga: "/audio/YogaSong.mp3",
};

const DEFAULT_MUSIC = "/audio/HomeSong.mp3";

export default function MusicPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(DEFAULT_MUSIC);

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
    if (pathname !== "/entrainement") {
      setCurrentMusic(DEFAULT_MUSIC);
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const date = searchParams.get("date");

    if (!date) {
      setCurrentMusic(DEFAULT_MUSIC);
      return;
    }

    try {
      const savedActivities = localStorage.getItem("plannedActivities");
      const plannedActivities = savedActivities
        ? JSON.parse(savedActivities)
        : {};

      const activity = plannedActivities[date];
      const music = MUSIC_BY_ACTIVITY[activity] ?? DEFAULT_MUSIC;

      setCurrentMusic(music);
    } catch {
      setCurrentMusic(DEFAULT_MUSIC);
    }
  }, [pathname]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = currentMusic;
    audioRef.current.load();

    if (hasStarted) {
      audioRef.current.play().catch(() => {
        // Le navigateur peut bloquer selon le contexte.
      });
    }
  }, [currentMusic, hasStarted]);

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
        // Rien, on réessaiera à la prochaine interaction.
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
      <audio ref={audioRef} src={currentMusic} loop />

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