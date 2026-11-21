export const areas = [
  {
    id: 'climb',
    title: 'The Climb',
    verb: 'Learn with purpose',
    description: 'Clear explanations. Small steps. Skills you can make your own.',
    detail: 'A thoughtful path from understanding a concept to using it independently. Teaching, worked examples, and fresh challenges will build on each other.',
    upcoming: 'Sequential lessons, worked examples, and independent coding challenges.',
  },
  {
    id: 'gym',
    title: 'The Gym',
    verb: 'Turn practice into instinct',
    description: 'Work on what trips you up. Keep what you’ve learned.',
    detail: 'A space for focused repair and lasting understanding. Practice will respond to evidence from your attempts and revisit skills in new contexts.',
    upcoming: 'Targeted workouts, mistake review, and spaced retrieval.',
  },
  {
    id: 'room',
    title: 'The Room',
    verb: 'Meet the moment',
    description: 'Bring it all together. Think clearly when the clock is running.',
    detail: 'A quiet space to put independent skills to the test. Timed practice will pair clear rules with an honest, evidence-based debrief.',
    upcoming: 'Timed interview simulations, independent assessments, and debriefs.',
  },
] as const;

export type AreaId = typeof areas[number]['id'];
export type LessonPath = `climb/${string}`;
export const lessonPath = (id: string, results = false): LessonPath =>
  `climb/${id}${results ? '/results' : ''}`;
export function parseLessonPath(path: string) {
  const match = /^climb\/([\w.-]+)(\/results)?$/.exec(path);
  return match ? { id: match[1], results: !!match[2] } : undefined;
}
export const gymWorkoutPath = 'gym/workout';
export const gymResultsPath = 'gym/results';
export type Route = 'home' | AreaId | LessonPath | typeof gymWorkoutPath | typeof gymResultsPath;

export function readRoute(): Route {
  const path = window.location.hash.replace(/^#\/?/, '');
  if (path === gymWorkoutPath || path === gymResultsPath) return path;
  if (parseLessonPath(path)) return path as LessonPath;
  return areas.find((area) => area.id === path)?.id ?? 'home';
}
