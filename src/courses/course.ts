import { pilotPack, pilotSequence } from './f01-01';
import { loadCoursePack, validateNumericSequence } from './load-course-pack';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

export const coursePack = pilotPack;
export const course = loadCoursePack(coursePack, { 'F01.01': pilotSequence });
for (const item of course) {
  validateNumericSequence(item, { engineId: pythonEngineId, language: 'python', runtimeVersion: pythonVersion });
}
