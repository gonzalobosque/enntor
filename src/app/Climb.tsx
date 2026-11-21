import { course, coursePack } from '../courses/course';
import { unmetPrerequisites } from '../courses/load-course-pack';
import { readPackEvidence } from '../learning/evidence';
import { ClimbLesson } from '../learning/ClimbLesson';
import { lessonPath } from './areas';

function readProgress() {
  try {
    const history = readPackEvidence(coursePack.id);
    return { history, completed: new Set(history.filter((item) => item.completion).map((item) => item.lesson.id)), error: false };
  } catch {
    return { history: [], completed: new Set<string>(), error: true };
  }
}

export function Climb({ route }: { route?: { id: string; results: boolean } }) {
  const { history, completed, error } = readProgress();
  const item = route && course.find(({ lesson }) => lesson.id === route.id);
  const canOpen = item && (completed.has(item.lesson.id) || unmetPrerequisites(item, coursePack, completed).length === 0);
  if (item && canOpen) return <ClimbLesson key={item.lesson.id} item={item} results={route.results} />;

  const blocked = item && unmetPrerequisites(item, coursePack, completed);
  return <article className="pilot">
    <a className="back-link" href="#/">← Back to home</a>
    <p className="eyebrow">Learn with purpose</p>
    <h1>The <span>Climb</span></h1>
    {error && <p role="alert">Saved lesson progress could not be read. Locked lessons will open when their prerequisites can be verified.</p>}
    {route && !item && <p role="status">This lesson is unavailable in the current course pack.</p>}
    {item && !!blocked?.length && <p role="status">{item.lesson.id} opens after {blocked.join(', ')}.</p>}
    <p>{coursePack.description}</p>
    {coursePack.modules.map((module) => <section className="pilot-section" key={module.id} aria-labelledby={`module-${module.id}`}>
      <h2 id={`module-${module.id}`} className="pilot-stage-heading">{module.id} · {module.title}</h2>
      <ol className="climb-lessons">{course.filter((entry) => entry.module.id === module.id).map((entry) => {
        const { lesson } = entry;
        const missing = unmetPrerequisites(entry, coursePack, completed);
        const done = completed.has(lesson.id);
        const saved = history.some((record) => record.lesson.id === lesson.id && (record.lesson.version === lesson.version || !!entry.sequence.resumeFrom?.[record.lesson.version]));
        return <li key={lesson.id}>
          <h3 className="pilot-exercise-heading">{lesson.id} · {lesson.title}</h3>
          <p className="muted">{done ? 'Completed' : missing.length ? `Locked · finish ${missing.join(', ')} first` : saved ? 'In progress' : 'Available'} · {lesson.estimatedMinutes} min</p>
          {(done || !missing.length) && <div className="pilot-controls">
            <a className="pilot-link" href={`#/${lessonPath(lesson.id)}`} aria-label={`${saved && !done ? 'Resume' : 'Open'} ${lesson.id} · ${lesson.title}`}>
              {saved && !done ? 'Resume lesson' : done ? 'Revisit lesson' : 'Open lesson'}
            </a>
            {done && <a className="pilot-inline-link" href={`#/${lessonPath(lesson.id, true)}`} aria-label={`View report for ${lesson.id}`}>View report</a>}
          </div>}
        </li>;
      })}</ol>
    </section>)}
  </article>;
}
