"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CalisthenicsSetup from "@/components/CalisthenicsSetup";
import ExerciseTimer from "@/components/ExerciseTimer";
import ExerciseCarousel from "@/components/ExerciseCarousel";
import type { CalisthenicsGoal, CalisthenicsLevel, WorkoutExercise } from "@/data/calisthenics";
import { buildCircuit } from "@/lib/workout";

const REST_EXERCISE: WorkoutExercise = {
  title: "Repos",
  image: "/images/Repos_Muscu.png",
  instructions: "Récupère quelques secondes avant la prochaine série.",
};

const EXERCISES: Record<string, WorkoutExercise[]> = {
  Muscu: [
    {
      title: "Échauffement",
      image: "/images/0_Echauffement_Muscu.png",
      instructions: "Commence doucement pour échauffer le corps.",
    },
    {
      title: "Squat avec haltères",
      image: "/images/1_Squat avec haltères.png",
      instructions: "Garde le dos droit et descends de façon contrôlée.",
    },
    {
      title: "Soulever de terre",
      image: "/images/2_SouleverDeTerre.png",
      instructions: "Monte et redescends en gardant le dos gainé.",
    },
    {
      title: "Rowing haltères",
      image: "/images/3_Rowing haltères.png",
      instructions: "Tire les haltères vers toi en contrôlant le mouvement.",
    },
    {
      title: "Pompes",
      image: "/images/4_Pompes.png",
      instructions: "Fais une série de pompes à ton rythme.",
    },
    {
      title: "Élévation latérale élastique",
      image: "/images/5_Élévation latérale élastique.png",
      instructions: "Lève les bras latéralement sans à-coups.",
    },
    {
      title: "Curl haltères assis",
      image: "/images/6_Curl haltères assis.png",
      instructions: "Monte les haltères en gardant les coudes proches du corps.",
    },
    {
      title: "Roue abdos",
      image: "/images/7_Roue abdos.png",
      instructions: "Avance doucement puis reviens en gardant le gainage.",
    },
    {
      title: "Gainage planche",
      image: "/images/8_Gainage_Planche.png",
      instructions: "Tiens la position en gardant le corps bien aligné.",
    },
    {
      title: "Étirement",
      image: "/images/9_EtirementMuscu.png",
      instructions: "Termine la séance par un retour au calme et des étirements.",
    },
  ],
  Jogging: [
    {
      title: "Course",
      image: "/images/Jogging.png",
      instructions: "Cours à une allure régulière et confortable.",
    },
    {
      title: "Étirement",
      image: "/images/Etirement_Cardio.png",
      instructions: "Etire toi bien",
    },
  ],
  Vélo: [
    {
      title: "Effort principal",
      image: "/images/Vélo.png",
      instructions: "Augmente un peu le rythme ou la résistance.",
    },
    {
      title: "Étirement",
      image: "/images/Etirement_Cardio.png",
      instructions: "Etire toi bien",
    },
  ],
  Yoga: [
    {
      title: "Balasana",
      image: "/images/Yoga_1.png",
      instructions: "Posture de l'enfant",
    },
    {
      title: "Adho muka svanasana",
      image: "/images/Yoga_2.png",
      instructions: "Posture du Chien",
    },
    {
      title: "Anjaneyasana",
      image: "/images/Yoga_3.png",
      instructions: "Fente Basse",
    },
    {
      title: "Eka pada rajakapotasana",
      image: "/images/Yoga_4.png",
      instructions: "Position du Pigeon",
    },
    {
      title: "Paschimottanasana",
      image: "/images/Yoga_5.png",
      instructions: "Étirement des jambes tendu.",
    },
    {
      title: "Ouverture Thoracique",
      image: "/images/Yoga_6.png",
      instructions: "La Respiration de la Montagne",
    },
    {
      title: "Ardha Matsyendrasana",
      image: "/images/Yoga_7.png",
      instructions: "Demi trosion assise.",
    },
  ],
};

export default function EntrainementClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const [plannedActivities, setPlannedActivities] = useState<
    Record<string, string>
  >({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [calisthenicsSelection, setCalisthenicsSelection] = useState<{
    goal: CalisthenicsGoal;
    level: CalisthenicsLevel;
  } | null>(null);
  const [yogaTimerDuration, setYogaTimerDuration] = useState<number | null>(null);
  const [hasChosenYogaMode, setHasChosenYogaMode] = useState(false);

  useEffect(() => {
    const savedActivities = localStorage.getItem("plannedActivities");

    if (savedActivities) {
      setPlannedActivities(JSON.parse(savedActivities));
    }

    setIsLoaded(true);
  }, []);

  const selectedActivity = date ? plannedActivities[date] : null;
  const isCalisthenics = selectedActivity === "Street workout";
  const program = isCalisthenics ? calisthenicsSelection?.level : undefined;
  const isCircuit = selectedActivity === "Muscu" || isCalisthenics;
  const TOTAL_SERIES = program?.series ?? (selectedActivity === "Muscu" ? 3 : 1);

  const exercises = useMemo(() => {
    if (selectedActivity === "Street workout") {
      if (!program) return [];
      return buildCircuit(program.warmup, program.exercises, program.cooldown, program.series, {
        title: "Repos",
        image: "/images/SW_REPOS.png",
        instructions: `Récupère pendant ${program.restSeconds} secondes avant la prochaine série.`,
        durationSeconds: program.restSeconds > 0 ? program.restSeconds : undefined,
      });
    }
    const base = selectedActivity ? EXERCISES[selectedActivity] ?? [] : [];
    if (selectedActivity !== "Muscu" || base.length < 3) return base;
    return buildCircuit(base[0], base.slice(1, -1), base[base.length - 1], 3, REST_EXERCISE);
  }, [selectedActivity, program]);

  const currentExercise = exercises[currentExerciseIndex];

  const baseExercises = program
    ? [program.warmup, ...program.exercises, program.cooldown]
    : selectedActivity ? EXERCISES[selectedActivity] ?? [] : [];

const exercisesPerSeries =
  isCircuit
    ? Math.max(baseExercises.length - 2, 1)
    : baseExercises.length;

const isWarmup = isCircuit && currentExerciseIndex === 0;

const isCooldown =
  isCircuit &&
  currentExerciseIndex === exercises.length - 1;

const isRest = currentExercise?.title === "Repos";

const isPlank = selectedActivity === "Muscu" && currentExercise?.title === "Gainage planche";
const isYoga = selectedActivity === "Yoga";
const timerDuration = currentExercise?.durationSeconds ?? (isPlank ? 40 : isYoga ? yogaTimerDuration : null);

const circuitExerciseIndexesBeforeCurrent =
  isCircuit
    ? exercises
        .slice(1, currentExerciseIndex + 1)
        .filter((exercise) => exercise.title !== "Repos").length
    : 0;

const currentSeries =
  isCircuit && !isWarmup && !isCooldown && !isRest
    ? Math.floor((circuitExerciseIndexesBeforeCurrent - 1) / exercisesPerSeries) + 1
    : null;

const currentExerciseInSeries =
  isCircuit && !isWarmup && !isCooldown && !isRest
    ? ((circuitExerciseIndexesBeforeCurrent - 1) % exercisesPerSeries) + 1
    : null;

  function finishTraining() {
    if (!date) return;

    const savedValidatedDays = localStorage.getItem("validatedDays");
    const validatedDays = savedValidatedDays
      ? JSON.parse(savedValidatedDays)
      : {};

    validatedDays[date] = true;
    localStorage.setItem("validatedDays", JSON.stringify(validatedDays));

    router.push("/");
  }

  function goToNextExercise() {
    const isLastExercise = currentExerciseIndex === exercises.length - 1;

    if (isLastExercise) {
      finishTraining();
      return;
    }

    setCurrentExerciseIndex((prev) => prev + 1);
  }

  function goToPreviousExercise() {
    if (currentExerciseIndex === 0) return;
    setCurrentExerciseIndex((prev) => prev - 1);
  }

  function goBackToCalendar() {
    const confirmQuit = window.confirm("Quitter l'entraînement ?");
    if (confirmQuit) {
      router.push("/");
    }
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </main>
    );
  }
if (isCalisthenics && !calisthenicsSelection) {
  return (
    <CalisthenicsSetup
      onBack={() => router.push("/")}
      onStart={(goal, level) => {
        setCurrentExerciseIndex(0);
        setCalisthenicsSelection({ goal, level });
      }}
    />
  );
}
if (selectedActivity === "Yoga" && !hasChosenYogaMode) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-green-500/50 bg-zinc-950 p-6 text-center shadow-[0_0_12px_rgba(34,197,94,0.15)]">
        <h1 className="text-2xl font-bold text-white">Choisis ton rythme</h1>

        <p className="mt-2 text-sm text-green-300/80">
          Sélectionne la durée pour chaque posture de yoga.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
              setYogaTimerDuration(40);
              setHasChosenYogaMode(true);
            }}
            className="w-full rounded-xl bg-green-500 px-4 py-4 text-sm font-bold text-black hover:opacity-90"
          >
            Yoga doux — 40s
          </button>

          <button
            onClick={() => {
              setYogaTimerDuration(75);
              setHasChosenYogaMode(true);
            }}
            className="w-full rounded-xl border border-green-500/50 bg-black px-4 py-4 text-sm font-bold text-white hover:bg-green-900/30"
          >
            Yoga profond — 75s
          </button>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-5 text-sm text-gray-400 hover:text-white"
        >
          Retour au calendrier
        </button>
      </div>
    </main>
  );
}
  if (!date || !selectedActivity || exercises.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Entraînement introuvable</h1>
          <p className="mt-3 text-gray-600">
            Aucune activité n’est planifiée pour cette date.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-5 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Retour au calendrier
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col">
      <div className="relative px-14 py-2 text-center sm:p-4">
        <button
          aria-label="Quitter la séance"
          onClick={goBackToCalendar}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-green-500/40 bg-black/70 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)] backdrop-blur-sm"
        >
          ✕
        </button>

        <p className="text-sm opacity-70">
          {isCircuit ? (
  isWarmup ? (
    <>Échauffement</>
  ) : isCooldown ? (
    <>Étirement</>
  ) : isRest ? (
    <>Repos</>
  ) : (
    <>
      {isCalisthenics ? "Tour" : "Série"} {currentSeries} / {TOTAL_SERIES} — Exercice{" "}
      {currentExerciseInSeries} / {exercisesPerSeries}
    </>
  )
) : (
  <>Exercice {currentExerciseIndex + 1} / {exercises.length}</>
)}
        </p>

        {isCalisthenics && calisthenicsSelection && (
          <p className="mt-1 text-xs text-green-400 sm:mt-2 sm:text-sm">
            {calisthenicsSelection.goal.name} — Niveau {calisthenicsSelection.level.id}
          </p>
        )}
        <h1 className="mt-1 text-lg font-semibold sm:text-xl">{currentExercise.title}</h1>

      </div>

      <ExerciseCarousel
        exercises={exercises}
        currentIndex={currentExerciseIndex}
        onChange={setCurrentExerciseIndex}
      />
      <div className="hidden min-h-64 flex-1 items-center justify-center px-4 sm:flex">
        {currentExercise.image ? (
          <img
            src={currentExercise.image}
            alt={currentExercise.title}
            className="max-h-[55vh] w-full object-contain"
          />
        ) : (
          <p className="max-w-xl py-8 text-center text-lg text-green-100">{currentExercise.instructions || currentExercise.title}</p>
        )}
      </div>

      <div className="px-4 py-3 sm:p-6">
        {currentExercise.image && (
          <p className="mx-auto mb-2 max-w-xl text-center text-sm text-gray-300 sm:mb-4 sm:text-base">{currentExercise.instructions}</p>
        )}
        {timerDuration !== null && timerDuration > 0 && (
          <ExerciseTimer
            key={currentExerciseIndex + ":" + timerDuration}
            duration={timerDuration}
            onComplete={goToNextExercise}
          />
        )}
        <div className="mx-auto mt-4 hidden max-w-xl gap-3 sm:flex">
          <button
            onClick={goToPreviousExercise}
            disabled={currentExerciseIndex === 0}
            className="flex-1 rounded-xl border border-green-500/40 px-4 py-3 disabled:opacity-40"
          >
            Précédent
          </button>
          <button
            onClick={goToNextExercise}
            className="flex-1 rounded-xl bg-green-500 px-4 py-3 font-semibold text-black"
          >
            {currentExerciseIndex === exercises.length - 1 ? "Terminer la séance" : "Suivant"}
          </button>
        </div>

        {currentExerciseIndex === exercises.length - 1 && (
          <button
            onClick={finishTraining}
            className="mx-auto mt-4 block w-full max-w-xl rounded-xl bg-green-500 px-4 py-3 font-semibold text-black sm:hidden"
          >
            Terminer la séance
          </button>
        )}
      </div>
    </main>
  );
}