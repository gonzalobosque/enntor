import { pilotPack, pilotSequence } from './f01-01';
import { f0102Exercises, f0102Lesson, f0102Sequence } from './f01-02';
import { f0103Exercises, f0103Lesson, f0103Sequence } from './f01-03';
import { f0104Exercises, f0104Lesson, f0104Sequence } from './f01-04';
import { f0105Exercises, f0105Lesson, f0105Sequence } from './f01-05';
import { f0106Exercises, f0106Lesson, f0106Sequence } from './f01-06';
import { loadCoursePack, validatePythonSequence } from './load-course-pack';
import { pythonEngineId, pythonVersion } from '../execution/python-config';
import { ladder } from './python-foundation';
import type { CoursePack, Exercise } from './contracts';

// Preserve the original authored pilot and add final MAKE help for this edition.
const pilotTransferId = 'F01.01.make-transfer';
const pilotTransfer: Exercise = {
  ...pilotPack.exercises.find(exercise => exercise.id === pilotTransferId)!,
  version: '1.1.0',
  hints: ladder('Identify the original points and the penalty. Which amount does the tournament value at twice its face value?',
    'Find the value of the points before considering the penalty. A negative penalty adds a credit.',
    'Seven points are worth 14. A three-point penalty leaves 11. With a negative penalty, subtracting it increases the score.',
    'def adjust_score(score, penalty):\n    return 2 * score - penalty'),
};

const upcoming = [
  { lesson: f0104Lesson, exercises: f0104Exercises, sequence: f0104Sequence },
  { lesson: f0105Lesson, exercises: f0105Exercises, sequence: f0105Sequence },
  { lesson: f0106Lesson, exercises: f0106Exercises, sequence: f0106Sequence },
];

export const coursePack = {
  ...pilotPack, version: '1.8.0', description: 'Start with expressions, then follow how Python names and objects change.',
  modules: [{ ...pilotPack.modules[0], version: '1.5.0', lessonIds: ['F01.01', f0102Lesson.id, f0103Lesson.id, ...upcoming.map(item => item.lesson.id)] }],
  lessons: [{ ...pilotPack.lessons[0], version: '1.4.0' }, f0102Lesson, f0103Lesson, ...upcoming.map(item => item.lesson)],
  exercises: [...pilotPack.exercises.map(exercise => exercise.id === pilotTransferId ? pilotTransfer : exercise), ...f0102Exercises, ...f0103Exercises, ...upcoming.flatMap(item => item.exercises)],
} satisfies CoursePack;
export const course = loadCoursePack(coursePack, {
  'F01.01': { ...pilotSequence, resumeFrom: { '1.3.0': { [pilotTransferId]: '1.0.0' } },
    equivalentExerciseVersions: { [pilotTransferId]: ['1.0.0'] } }, [f0102Lesson.id]: f0102Sequence, [f0103Lesson.id]: f0103Sequence,
  ...Object.fromEntries(upcoming.map(item => [item.lesson.id, item.sequence])),
});
for (const item of course) {
  validatePythonSequence(item, { engineId: pythonEngineId, language: 'python', runtimeVersion: pythonVersion });
}
