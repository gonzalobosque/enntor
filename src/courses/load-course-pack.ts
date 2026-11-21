import type { TraceCheck } from '../learning/trace';
import type { CoursePack, Exercise, JsonValue, TeachingProse } from './contracts';

export interface LessonSequence {
  learnTitle: string;
  trace?: TraceCheck;
  transferTrace?: TraceCheck;
  offerTransferPractice?: boolean;
  titleAccent?: string;
  // A copy edit keeps the previous edition's behavioral contract and draft shape.
  equivalentExerciseVersions?: Record<string, string[]>;
  draftsFromLesson?: string;
  resumeFrom?: Record<string, Record<string, string>>;
  legacy?: { draftExerciseId: string; draftVersion: string };
  predictionCoaching: {
    explanation: TeachingProse;
    modifyFeedback?: TeachingProse;
    hypothesis?: {
      id: string;
      answer: number;
      possibleReasoning: TeachingProse;
      actualReasoning: TeachingProse;
      question: string;
      confirm: string;
      confirmedFeedback: string;
      rejectedFeedback: string;
      report: { confirmed: string; rejected: string; unconfirmed: string };
    };
    followUp: { code: string; expected: number; hint: TeachingProse; explanation: TeachingProse };
  };
  buildPlan: {
    prompt: TeachingProse;
    example?: { input: JsonValue[]; expected: JsonValue };
    options: { id: string; text: string }[];
    correct: string;
    syntax: TeachingProse;
    retry: string;
    report: string;
  };
}

const version = /^\d+\.\d+\.\d+$/;
const id = /^[\w.-]+$/;

export function loadCoursePack(pack: CoursePack, sequences: Record<string, LessonSequence>) {
  const require = (valid: unknown, message: string) => {
    if (!valid) throw new Error(`Invalid Course Pack ${pack.id}: ${message}.`);
  };
  const unique = <T extends { id: string; version: string }>(items: T[]) => {
    const map = new Map(items.map((item) => [item.id, item]));
    require(map.size === items.length && items.every((item) => id.test(item.id) && version.test(item.version)),
      'duplicate or invalid content reference');
    return map;
  };
  unique([pack]);
  require(pack.schemaVersion === '1.0' && pack.modules.length && pack.lessons.length, 'schema or empty pack');
  unique(pack.modules);
  const lessons = unique(pack.lessons);
  const exercises = unique(pack.exercises);
  const earlierModules = new Set<string>();
  const earlierLessons = new Set<string>();
  const usedExercises = new Set<string>();
  const loaded = pack.modules.flatMap((module) => {
    require(module.lessonIds.length && module.prerequisites.every((key) => earlierModules.has(key)), module.id + ' prerequisites');
    const result = module.lessonIds.map((lessonId) => {
      const lesson = lessons.get(lessonId);
      require(lesson && lesson.moduleId === module.id && !earlierLessons.has(lessonId), lessonId + ' module placement');
      require(lesson!.prerequisites.every((key) => earlierLessons.has(key)), lessonId + ' prerequisites must precede it');
      earlierLessons.add(lessonId);
      const activities = lesson!.exerciseIds.map((key) => {
        const exercise = exercises.get(key);
        require(exercise?.lessonId === lessonId && !usedExercises.has(key), key + ' exercise ownership');
        usedExercises.add(key);
        return exercise!;
      });
      const [prediction, modification, build, make, transfer] = activities;
      require(activities.map(({ kind }) => kind).join(',') === 'predict,modify,write,write,transfer' &&
        lesson!.progression.requiredExerciseIds.join(',') === activities.slice(0, 4).map(({ id }) => id).join(',') &&
        lesson!.progression.requiresIndependentTransfer, lessonId + ' prediction-to-transfer sequence');
      const sequence = sequences[lessonId];
      require(sequence && new Set(sequence.buildPlan.options.map(({ id }) => id)).size === sequence.buildPlan.options.length &&
        sequence.buildPlan.options.some(({ id }) => id === sequence.buildPlan.correct), lessonId + ' Build choice');
      for (const trace of [sequence.trace, sequence.transferTrace]) {
        if (!trace) continue;
        require(trace.id.startsWith(lessonId + '.') && version.test(trace.version) && trace.columns.length && trace.rows.length &&
          trace.help.concept.length && trace.help.guidance.length && trace.help.worked.length === trace.rows.length &&
          trace.help.worked.every(line => line.length) && new Set(trace.columns).size === trace.columns.length &&
          new Set(trace.rows.map(row => row.label)).size === trace.rows.length &&
          trace.rows.every(row => row.expected.length === trace.columns.length && row.expected.every(cell => cell.trim() === cell && cell === cell.toLowerCase() && !!cell)),
        trace.id + ' trace grid');
        const labels = trace.labelChoices;
        require(!labels || (labels.column >= 0 && labels.column < trace.columns.length && labels.options.length >= 2 &&
          trace.rows.every(row => labels.options.some(label => label.toLowerCase() === row.expected[labels.column]))),
        trace.id + ' trace response labels');
      }
      require(!sequence.trace || sequence.trace.id !== sequence.transferTrace?.id, lessonId + ' repeated trace ID');
      return { pack: { id: pack.id, version: pack.version }, module, lesson: lesson!, sequence,
        prediction, modification, build, make, transfer };
    });
    earlierModules.add(module.id);
    return result;
  });
  require(earlierLessons.size === lessons.size && usedExercises.size === exercises.size &&
    Object.keys(sequences).length === lessons.size, 'orphaned lessons, sequences or exercises');
  return loaded;
}

export type LoadedLesson = ReturnType<typeof loadCoursePack>[number];

export function unmetPrerequisites(item: LoadedLesson, pack: CoursePack, completed: ReadonlySet<string>) {
  const moduleLessons = pack.modules.filter(({ id }) => item.module.prerequisites.includes(id)).flatMap(({ lessonIds }) => lessonIds);
  return [...new Set([...moduleLessons, ...item.lesson.prerequisites])].filter((id) => !completed.has(id));
}

function isListValue(value: JsonValue): boolean {
  return Array.isArray(value) ? value.every(isListValue) : typeof value === 'string' || Number.isSafeInteger(value);
}

export function validatePythonSequence(item: LoadedLesson, runtime: Pick<NonNullable<Exercise['execution']>, 'engineId' | 'language' | 'runtimeVersion'>) {
  const require = (valid: unknown, message: string) => {
    if (!valid) throw new Error(`Invalid Python sequence for ${item.lesson.id}: ${message}.`);
  };
  for (const exercise of [item.prediction, item.modification, item.build, item.make, item.transfer]) {
    const config = exercise.execution;
    const cases = exercise.grading.publicCases;
    require(exercise.starterCode?.trim() && exercise.prompt.length && config &&
      config.engineId === runtime.engineId && config.language === runtime.language && config.runtimeVersion === runtime.runtimeVersion &&
      !config.allowedDependencies.length && Object.values(config.limits).every((limit) => Number.isSafeInteger(limit) && limit > 0), exercise.id + ' runtime');
    const observesArguments = exercise.grading.graderId === 'return-and-arguments';
    require(new Set(cases.map(({ id }) => id)).size === cases.length &&
      cases.every(({ id, input, expected, expectedArguments }) => id && Array.isArray(input) &&
        (observesArguments
          ? input.every(isListValue) && isListValue(expected) && Array.isArray(expectedArguments) &&
            expectedArguments.length === input.length && expectedArguments.every(isListValue)
          : input.every(Number.isSafeInteger) && Number.isSafeInteger(expected) && expectedArguments === undefined)),
      exercise.id + ' case data');
    if (exercise === item.prediction) {
      require(!config?.entryPoint && exercise.grading.graderId === 'stdout-number' &&
        cases.length === 1 && Array.isArray(cases[0].input) && cases[0].input.length === 0, 'prediction case');
    } else {
      require(/^[a-zA-Z_]\w*$/.test(config?.entryPoint ?? '') && (exercise.grading.graderId === 'return-value' || observesArguments) &&
        cases.length >= 3 && new Set(cases.map(({ input }) => JSON.stringify(input))).size === cases.length &&
        cases.every(({ input }) => Array.isArray(input) && Array.isArray(cases[0].input) && input.length === cases[0].input.length),
      exercise.id + ' grader');
    }
  }
}
