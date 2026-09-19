import type { WorkoutExercise } from "../data/calisthenics";

export function buildCircuit(
  warmup: WorkoutExercise,
  exercises: WorkoutExercise[],
  cooldown: WorkoutExercise,
  series: number,
  rest: WorkoutExercise
): WorkoutExercise[] {
  if (!Number.isInteger(series) || series < 1 || exercises.length === 0) {
    return [];
  }
  const workout = [warmup];
  for (let round = 0; round < series; round++) {
    workout.push(...exercises);
    if (round < series - 1) workout.push(rest);
  }
  workout.push(cooldown);
  return workout;
}
