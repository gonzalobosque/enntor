import { pilotPack } from './f01-01';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

export function loadPilot() {
  const [lesson] = pilotPack.lessons;
  const [module] = pilotPack.modules;
  const [prediction, modification] = pilotPack.exercises;
  const require = (valid: boolean, subject: string) => {
    if (!valid) throw new Error(`Invalid F01.01 pilot content: ${subject}.`);
  };
  require(pilotPack.schemaVersion === '1.0' && lesson.id === 'F01.01' &&
    lesson.moduleId === module.id && module.lessonIds.includes(lesson.id), 'lesson and module references');
  require(pilotPack.lessons.length === 1 && pilotPack.modules.length === 1 &&
    pilotPack.exercises.length === 2 && !lesson.prerequisites.length && !module.prerequisites.length,
  'pilot scope');
  require(prediction.kind === 'predict' && modification.kind === 'modify' &&
    new Set([prediction.id, modification.id]).size === 2 &&
    lesson.exerciseIds.join(',') === [prediction.id, modification.id].join(',') &&
    lesson.progression.requiredExerciseIds.join(',') === lesson.exerciseIds.join(','), 'activity order');
  for (const exercise of pilotPack.exercises) {
    const runtime = exercise.execution;
    require(exercise.lessonId === lesson.id && !!exercise.starterCode?.trim() &&
      !!exercise.prompt.trim() && runtime?.engineId === pythonEngineId &&
      runtime.language === 'python' && runtime.runtimeVersion === pythonVersion &&
      !runtime.allowedDependencies.length &&
      Object.values(runtime.limits).every((limit) => Number.isSafeInteger(limit) && limit > 0), exercise.id);
  }
  require(!prediction.execution?.entryPoint && prediction.grading.graderId === 'stdout-number' &&
    prediction.grading.publicCases.length === 1 &&
    Number.isSafeInteger(prediction.grading.publicCases[0].expected) &&
    typeof prediction.grading.configuration.explanation === 'string', 'prediction grader');
  const cases = modification.grading.publicCases;
  require(modification.grading.graderId === 'return-value' &&
    /^[a-zA-Z_]\w*$/.test(modification.execution?.entryPoint ?? '') &&
    cases.length >= 3 && new Set(cases.map(({ id }) => id)).size === cases.length &&
    cases.every(({ input, expected }) => Array.isArray(input) && input.length === 2 &&
      input.every(Number.isSafeInteger) && Number.isSafeInteger(expected)), 'modification tests');
  return { lesson, prediction, modification };
}
