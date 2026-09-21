"use client";

import { useEffect, useRef } from "react";
import type { WorkoutExercise } from "@/data/calisthenics";

export default function ExerciseCarousel({
  exercises,
  currentIndex,
  onChange,
}: {
  exercises: WorkoutExercise[];
  currentIndex: number;
  onChange: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(currentIndex);

  useEffect(() => {
    activeIndex.current = currentIndex;
    const track = trackRef.current;
    const card = track?.children[currentIndex] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - track.clientWidth * 0.03,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [currentIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settleTimeout: ReturnType<typeof setTimeout>;
    const selectClosestCard = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = activeIndex.current;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const nextDistance = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = index;
        }
      });
      if (track.clientWidth > 0 && closest !== activeIndex.current) onChange(closest);
    };
    const handleScroll = () => {
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(selectClosestCard, 150);
    };
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(settleTimeout);
      const card = track.children[activeIndex.current] as HTMLElement | undefined;
      if (card) track.scrollTo({ left: card.offsetLeft - track.clientWidth * 0.03, behavior: "instant" });
    });
    resizeObserver.observe(track);
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(settleTimeout);
      resizeObserver.disconnect();
      track.removeEventListener("scroll", handleScroll);
    };
  }, [onChange, exercises]);

  return (
    <div className="min-w-0 flex-1 sm:hidden">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Exercices de la séance"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          onChange(Math.max(0, Math.min(exercises.length - 1, currentIndex + (event.key === "ArrowRight" ? 1 : -1))));
        }}
        className="relative flex snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain px-[3%] py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-green-400"
      >
        {exercises.map((exercise, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${exercises.length} : ${exercise.title}`}
            aria-current={index === currentIndex ? "step" : undefined}
            className={`flex min-h-64 w-full shrink-0 snap-center snap-always flex-col justify-center overflow-hidden rounded-2xl border bg-zinc-950 transition-[opacity,transform,border-color] duration-200 motion-reduce:transition-none ${index === currentIndex ? "scale-100 border-green-500/60 opacity-100" : "scale-95 border-green-500/20 opacity-50"}`}
          >
            {exercise.image ? (
              <img src={exercise.image} alt={exercise.title} loading={Math.abs(index - currentIndex) <= 1 ? "eager" : "lazy"} draggable={false} className="h-[70svh] w-full object-contain" />
            ) : (
              <p className="flex h-[70svh] px-4 items-center justify-center text-center text-lg text-green-100">{exercise.instructions || exercise.title}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2" aria-hidden="true">
        {exercises.map((_, index) => Math.abs(index - currentIndex) <= 2 && (
          <span key={index} className={`h-1.5 rounded-full transition-[width,background-color] motion-reduce:transition-none ${index === currentIndex ? "w-6 bg-green-400" : "w-1.5 bg-zinc-600"}`} />
        ))}
      </div>
      <p className="mt-1.5 text-center text-xs text-gray-400" aria-live="polite">
        {currentIndex + 1} / {exercises.length} · {currentIndex === exercises.length - 1 ? "Dernier exercice" : "Glisse pour changer d’exercice"}
      </p>
    </div>
  );
}