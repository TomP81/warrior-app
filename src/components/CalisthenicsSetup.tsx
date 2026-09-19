"use client";

import { useState } from "react";
import {
  CALISTHENICS_GOALS,
  type CalisthenicsGoal,
  type CalisthenicsLevel,
} from "@/data/calisthenics";

type Props = {
  onStart: (goal: CalisthenicsGoal, level: CalisthenicsLevel) => void;
  onBack: () => void;
};

export default function CalisthenicsSetup({ onStart, onBack }: Props) {
  const [goal, setGoal] = useState<CalisthenicsGoal | null>(null);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-green-500/50 bg-zinc-950 p-6">
        <p className="text-sm text-green-400">Street workout</p>
        <h1 className="mt-2 text-2xl font-bold">
          {goal ? goal.name + " : choisis ton niveau" : "Choisis ton objectif"}
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          {goal ? "Chaque niveau comprend un échauffement, plusieurs tours et des étirements." : "Sélectionne la catégorie que tu souhaites travailler."}
        </p>
        <div className="mt-6 space-y-3">
          {goal ? goal.levels.map((level) => (
            <button
              key={level.id}
              disabled={level.exercises.length === 0}
              onClick={() => onStart(goal, level)}
              className="w-full rounded-xl border border-green-500/40 bg-black p-4 text-left hover:bg-green-900/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="block font-bold">{level.name}</span>
              <span className="mt-1 block text-sm text-gray-300">{level.description}</span>
              <span className="mt-2 block text-sm text-green-400">
                {level.series} tours · {level.exercises.length} exercices · repos {level.restSeconds}s entre les tours
              </span>
            </button>
          )) : CALISTHENICS_GOALS.map((item) => (
            <button
              key={item.id}
              disabled={item.levels.length === 0}
              onClick={() => setGoal(item)}
              className="w-full rounded-xl border border-green-500/40 bg-black p-4 text-left hover:bg-green-900/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="block font-bold">
                {item.name}{item.levels.length === 0 ? " — À venir" : ""}
              </span>
              <span className="mt-1 block text-sm text-gray-300">{item.description}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => goal ? setGoal(null) : onBack()}
          className="mt-6 rounded-lg px-3 py-2 text-sm text-green-300 hover:bg-green-900/30"
        >
          {goal ? "Retour aux objectifs" : "Retour au calendrier"}
        </button>
      </div>
    </main>
  );
}
