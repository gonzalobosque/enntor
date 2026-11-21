import { pilotPack, pilotSequence } from './f01-01';
import { f0102Exercises, f0102Lesson, f0102Sequence } from './f01-02';
import { f0103Exercises, f0103Lesson, f0103Sequence } from './f01-03';
import { loadCoursePack, validateNumericSequence } from './load-course-pack';
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

export const coursePack = {
  ...pilotPack, version: '1.7.0', description: 'Start with expressions, then follow how Python names and objects change.',
  modules: [{ ...pilotPack.modules[0], version: '1.4.0', lessonIds: ['F01.01', f0102Lesson.id, f0103Lesson.id] }],
  lessons: [{ ...pilotPack.lessons[0], version: '1.4.0' }, f0102Lesson, f0103Lesson],
  exercises: [...pilotPack.exercises.map(exercise => exercise.id === pilotTransferId ? pilotTransfer : exercise), ...f0102Exercises, ...f0103Exercises],
} satisfies CoursePack;
export const course = loadCoursePack(coursePack, {
  'F01.01': { ...pilotSequence, resumeFrom: { '1.3.0': { [pilotTransferId]: '1.0.0' } },
    equivalentExerciseVersions: { [pilotTransferId]: ['1.0.0'] } }, [f0102Lesson.id]: f0102Sequence, [f0103Lesson.id]: f0103Sequence,
});
for (const item of course) {
  validateNumericSequence(item, { engineId: pythonEngineId, language: 'python', runtimeVersion: pythonVersion });
}
