"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const DISCIPLINE_ICONS: Record<string, string> = {
  Muscu: "/images/Muscu_Icone.png",
  Jogging: "/images/Coursse.png",
  Vélo: "/images/Vélo_Icone.png",
  Yoga: "/images/Yoga_Icone.png",
};

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DISCIPLINES = ["Muscu", "Jogging", "Vélo", "Yoga"];

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayIndex(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const jsDay = new Date(year, month, 1).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Home() {
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [plannedActivities, setPlannedActivities] = useState<
    Record<string, string>
  >({});
  const [validatedDays, setValidatedDays] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(formatDateKey(today));

    const savedActivities = localStorage.getItem("plannedActivities");
    const savedValidatedDays = localStorage.getItem("validatedDays");

    try {
      if (savedActivities) {
        setPlannedActivities(JSON.parse(savedActivities));
      }

      if (savedValidatedDays) {
        setValidatedDays(JSON.parse(savedValidatedDays));
      }
    } catch {
      localStorage.removeItem("plannedActivities");
      localStorage.removeItem("validatedDays");
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("plannedActivities", JSON.stringify(plannedActivities));
  }, [plannedActivities, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("validatedDays", JSON.stringify(validatedDays));
  }, [validatedDays, isLoaded]);

  const calendarDays = useMemo(() => {
    if (!currentDate) return [];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayIndex = getFirstDayIndex(currentDate);

    const cells: Array<{
      type: "empty" | "day";
      day?: number;
      fullDate?: string;
      isToday?: boolean;
    }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ type: "empty" });
    }

    const today = new Date();
    const todayKey = formatDateKey(today);

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const fullDate = formatDateKey(cellDate);
      const isToday = fullDate === todayKey;

      cells.push({
        type: "day",
        day,
        fullDate,
        isToday,
      });
    }

    return cells;
  }, [currentDate]);

  const selectedActivity = selectedDate ? plannedActivities[selectedDate] : null;
  const isDayValidated = selectedDate ? validatedDays[selectedDate] : false;

  function goToPreviousMonth() {
    if (!currentDate) return;

    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    if (!currentDate) return;

    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }

  function handlePlanActivity(discipline: string) {
    if (!selectedDate) return;

    setPlannedActivities((prev) => ({
      ...prev,
      [selectedDate]: discipline,
    }));

    setValidatedDays((prev) => ({
      ...prev,
      [selectedDate]: false,
    }));
  }

  function removeActivity() {
    if (!selectedDate) return;

    setPlannedActivities((prev) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });

    setValidatedDays((prev) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });
  }

  function startTraining() {
    if (!selectedDate || !selectedActivity) return;
    router.push(`/entrainement?date=${selectedDate}`);
  }

  if (!currentDate) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-center gap-5 text-center">
          <div>
            <h1
              style={{ fontFamily: "var(--font-knewave)" }}
              className="text-5xl uppercase text-white"
            >
              WARRIOR
            </h1>

            <p className="mt-2 text-sm font-semibold tracking-[0.35em] text-[#84cc16]">
              TRAIN • MOVE • BREATHE
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goToPreviousMonth}
              className="rounded-xl border border-green-500/50 bg-black px-4 py-2 text-sm font-medium text-white hover:bg-green-900/30"
            >
              ←
            </button>

            <div className="min-w-[180px] text-center text-lg font-semibold capitalize text-green-300">
              {getMonthLabel(currentDate)}
            </div>

            <button
              onClick={goToNextMonth}
              className="rounded-xl border border-green-500/50 bg-black px-4 py-2 text-sm font-medium text-white hover:bg-green-900/30"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-green-500/50 bg-black shadow-[0_0_12px_rgba(34,197,94,0.15)]">
            <div className="grid grid-cols-7 border-b border-green-500/40 bg-black">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-semibold text-green-300"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((cell, index) => {
                if (cell.type === "empty") {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square border-r border-b border-green-500/30 bg-black"
                    />
                  );
                }

                const isSelected = selectedDate === cell.fullDate;
                const activity = cell.fullDate
                  ? plannedActivities[cell.fullDate]
                  : null;
                const isValidated = cell.fullDate
                  ? validatedDays[cell.fullDate]
                  : false;

                return (
                  <button
                    key={cell.fullDate}
                    onClick={() => setSelectedDate(cell.fullDate ?? null)}
                    className={`relative aspect-square overflow-hidden border-r border-b border-green-500/30 p-2 text-left transition sm:p-3 ${
                      isSelected
                        ? "bg-green-950 text-white"
                        : "bg-black hover:bg-green-900/20"
                    }`}
                  >
                    {activity && DISCIPLINE_ICONS[activity] && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <img
                          src={DISCIPLINE_ICONS[activity]}
                          alt={activity}
                          className={`h-full w-full object-contain p-1 ${
                            isSelected ? "opacity-45" : "opacity-90"
                          }`}
                        />
                      </div>
                    )}

                    {isValidated && (
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                        <span className="rounded bg-black/75 px-2 py-1 text-[10px] font-bold text-green-400 sm:text-xs">
                          ✅ OK
                        </span>
                      </div>
                    )}

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        {cell.isToday && !isSelected ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black shadow-[0_0_6px_#22c55e]">
                            {cell.day}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-white sm:text-sm">
                            {cell.day}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-green-500/50 bg-zinc-950 p-5 shadow-[0_0_12px_rgba(34,197,94,0.15)]">
            <h2 className="text-lg font-semibold text-white">
              Jour sélectionné
            </h2>

            <p className="mt-2 text-sm text-green-300/80">
              {selectedDate
                ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "Sélectionne un jour dans le calendrier"}
            </p>

            <div className="mt-5 space-y-3">
              {DISCIPLINES.map((discipline) => (
                <button
                  key={discipline}
                  onClick={() => handlePlanActivity(discipline)}
                  disabled={!selectedDate}
                  className="flex w-full items-center gap-3 rounded-xl border border-green-500/40 bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-green-900/20 disabled:opacity-50"
                >
                  <img
                    src={DISCIPLINE_ICONS[discipline]}
                    alt={discipline}
                    className="h-12 w-12 object-contain"
                  />

                  {discipline}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <button
                onClick={removeActivity}
                disabled={!selectedDate || !plannedActivities[selectedDate]}
                className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Supprimer l’activité du jour
              </button>
            </div>

            {selectedActivity && (
              <div className="mt-5 rounded-xl border border-green-500/30 bg-black p-4">
                <p className="text-sm text-green-300/80">Activité prévue</p>

                <p className="mt-1 text-base font-semibold text-white">
                  {selectedActivity}
                </p>

                <button
                  onClick={startTraining}
                  className="mt-4 w-full rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-black hover:opacity-90"
                >
                  Lancer l’entraînement
                </button>
              </div>
            )}

            {isDayValidated && (
              <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center text-sm font-medium text-green-400">
                Bravo, cette journée a été validée ✅
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}