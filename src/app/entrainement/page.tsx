"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const EXERCISES: Record<
  string,
  { title: string; image: string; instructions: string }[]
> = {
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

type EntrainementPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default function EntrainementPage({
  searchParams,
}: EntrainementPageProps) {
  const router = useRouter();

  const [date, setDate] = useState<string | null>(null);
  const [plannedActivities, setPlannedActivities] = useState<
    Record<string, string>
  >({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    async function loadPageData() {
      const resolvedSearchParams = await searchParams;
      setDate(resolvedSearchParams?.date ?? null);

      const savedActivities = localStorage.getItem("plannedActivities");
      if (savedActivities) {
        setPlannedActivities(JSON.parse(savedActivities));
      }

      setIsLoaded(true);
    }

    loadPageData();
  }, [searchParams]);

  const selectedActivity = date ? plannedActivities[date] : null;
  const TOTAL_SERIES = selectedActivity === "Muscu" ? 3 : 1;

  const REST_EXERCISE = {
    title: "Repos",
    image: "/images/Repos_Muscu.png",
    instructions: "Récupère quelques secondes avant la prochaine série.",
  };

  const exercises = useMemo(() => {
    if (!selectedActivity) return [];

    const baseExercises = EXERCISES[selectedActivity] ?? [];

    if (selectedActivity !== "Muscu") {
      return baseExercises;
    }

    if (baseExercises.length < 3) {
      return baseExercises;
    }

    const warmup = baseExercises[0];
    const cooldown = baseExercises[baseExercises.length - 1];
    const mainExercises = baseExercises.slice(1, -1);

    const workout: typeof baseExercises = [warmup];

    for (let i = 0; i < TOTAL_SERIES; i++) {
      workout.push(...mainExercises);

      if (i < TOTAL_SERIES - 1) {
        workout.push(REST_EXERCISE);
      }
    }

    workout.push(cooldown);
    return workout;
  }, [selectedActivity, TOTAL_SERIES]);

  const currentExercise = exercises[currentExerciseIndex];

  const baseExercises = selectedActivity ? EXERCISES[selectedActivity] ?? [] : [];
  const exercisesPerSeries =
    selectedActivity === "Muscu"
      ? Math.max(baseExercises.length - 2, 1)
      : baseExercises.length;

  const isWarmup = selectedActivity === "Muscu" && currentExerciseIndex === 0;
  const isCooldown =
    selectedActivity === "Muscu" && currentExerciseIndex === exercises.length - 1;
  const isPlank = currentExercise?.title === "Gainage planche";

  const currentSeries =
    selectedActivity === "Muscu" && !isWarmup && !isCooldown
      ? Math.floor((currentExerciseIndex - 1) / exercisesPerSeries) + 1
      : null;

  const currentExerciseInSeries =
    selectedActivity === "Muscu" && !isWarmup && !isCooldown
      ? ((currentExerciseIndex - 1) % exercisesPerSeries) + 1
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

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setTouchEndX(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNextExercise();
    } else if (distance < -minSwipeDistance) {
      goToPreviousExercise();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  }

  function startPlankTimer() {
    setTimeLeft(40);
    setIsTimerRunning(true);
  }

  useEffect(() => {
    if (!isPlank) {
      setTimeLeft(null);
      setIsTimerRunning(false);
      return;
    }

    setTimeLeft(40);
    setIsTimerRunning(false);
  }, [currentExerciseIndex, isPlank]);

  useEffect(() => {
    if (!isPlank || !isTimerRunning || timeLeft === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;

        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setTimeout(() => {
            goToNextExercise();
          }, 0);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlank, isTimerRunning, timeLeft]);

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

  if (!date || !selectedActivity || exercises.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Entraînement introuvable</h1>
          <p className="mt-3 text-gray-600">
            Aucune activité n’est planifiée pour cette date.
          </p>
          <button
            onClick={goBackToCalendar}
            className="mt-5 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Retour au calendrier
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen bg-black text-white flex flex-col">
      <div className="relative p-4 text-center">
        <button
          onClick={goBackToCalendar}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-green-500/40 bg-black/70 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)] backdrop-blur-sm"
        >
          ✕
        </button>

        <p className="text-sm opacity-70">
          {selectedActivity === "Muscu" ? (
            isWarmup ? (
              <>Échauffement</>
            ) : isCooldown ? (
              <>Étirement</>
            ) : (
              <>
                Série {currentSeries} / {TOTAL_SERIES} — Exercice{" "}
                {currentExerciseInSeries} / {exercisesPerSeries}
              </>
            )
          ) : (
            <>Exercice {currentExerciseIndex + 1} / {exercises.length}</>
          )}
        </p>

        <h1 className="mt-1 text-xl font-semibold">{currentExercise.title}</h1>

        {isPlank && timeLeft !== null && (
          <div className="mt-3">
            <p className="text-sm text-green-400">
              {isTimerRunning ? "Temps restant" : "Chrono prêt"}
            </p>
            <p className="text-4xl font-bold text-white">{timeLeft}s</p>
          </div>
        )}
      </div>

      <div
        className="flex-1 flex items-center justify-center px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentExercise.image ? (
          <img
            src={currentExercise.image}
            alt={currentExercise.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="text-gray-400">Image non disponible</div>
        )}
      </div>

      <div className="p-6">
        {isPlank && !isTimerRunning && (
          <button
            onClick={startPlankTimer}
            className="w-full rounded-2xl bg-white text-black text-lg font-bold py-5 shadow-lg active:scale-95 transition"
          >
            Lancer le chrono
          </button>
        )}

        <p className="mt-3 text-center text-xs text-gray-400">
          Glisse à gauche ou à droite pour changer d’exercice
        </p>
      </div>
    </main>
  );
}