import { pilotPack, pilotSequence } from './f01-01';
import { f0102Exercises, f0102Lesson, f0102Sequence } from './f01-02';
import { f0103Exercises, f0103Lesson, f0103Sequence } from './f01-03';
import { loadCoursePack, validateNumericSequence } from './load-course-pack';
import { pythonEngineId, pythonVersion } from '../execution/python-config';
import type { CoursePack } from './contracts';

export const coursePack = {
  ...pilotPack, version: '1.4.0', description: 'Start with expressions, then follow how Python names and objects change.',
  modules: [{ ...pilotPack.modules[0], version: '1.1.0', lessonIds: ['F01.01', f0102Lesson.id, f0103Lesson.id] }],
  lessons: [...pilotPack.lessons, f0102Lesson, f0103Lesson],
  exercises: [...pilotPack.exercises, ...f0102Exercises, ...f0103Exercises],
} satisfies CoursePack;
export const course = loadCoursePack(coursePack, {
  'F01.01': pilotSequence, [f0102Lesson.id]: f0102Sequence, [f0103Lesson.id]: f0103Sequence,
});
for (const item of course) {
  validateNumericSequence(item, { engineId: pythonEngineId, language: 'python', runtimeVersion: pythonVersion });
}
