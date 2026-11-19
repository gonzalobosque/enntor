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
export const pilotPath = 'climb/F01.01';
export const pilotResultsPath = 'climb/F01.01/results';
export const gymWorkoutPath = 'gym/workout';
export const gymResultsPath = 'gym/results';
export type Route = 'home' | AreaId | typeof pilotPath | typeof pilotResultsPath | typeof gymWorkoutPath | typeof gymResultsPath;

export function readRoute(): Route {
  const path = window.location.hash.replace(/^#\/?/, '');
  if (path === gymWorkoutPath || path === gymResultsPath) return path;
  if (path === pilotResultsPath) return pilotResultsPath;
  if (path === pilotPath) return pilotPath;
  return areas.find((area) => area.id === path)?.id ?? 'home';
}
