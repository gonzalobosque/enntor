import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTheme } from '../platform/useTheme';
import { Climb } from './Climb';
import { course, coursePack } from '../courses/course';
import { areas, gymResultsPath, gymWorkoutPath, parseLessonPath, readRoute } from './areas';
import type { AreaId } from './areas';

const Gym = lazy(async () => ({ default: (await import('../gym/Gym')).Gym }));

function Artwork({ area }: { area: AreaId }) {
  return (
    <div className={`artwork artwork-${area}`} aria-hidden="true">
      {area === 'climb' && <div className="steps"><i /><i /><i /><i /></div>}
      {area === 'gym' && <div className="rings"><i /><i /><i /></div>}
      {area === 'room' && <div className="door"><div className="door-inner"><i /></div></div>}
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="intro" aria-labelledby="home-heading">
        <div>
          <p className="eyebrow"><span className="live-dot" /> A little further, every time.</p>
          <h1 id="home-heading">Build the skill.<br /><span>Own the room.</span></h1>
        </div>
        <div className="intro-note">
          <p>Understand it. Practice it.<br /> Make it second nature.</p>
          <p className="muted">Your space to become<br /> an independent problem solver.</p>
        </div>
      </section>
      <section aria-label="Learning areas" className="area-grid">
        {areas.map((area) => (
          <a className={`area-card card-${area.id}`} href={`#/${area.id}`} key={area.id}>
            <Artwork area={area.id} />
            <div className="card-body">
              <p className="card-verb">{area.verb}</p>
              <div className="card-title"><h2>{area.title}</h2><span className="arrow" aria-hidden="true">↗</span></div>
              <p className="card-description">{area.description}</p>
              <span className="availability">{area.id === 'climb' ? 'Lessons available' : area.id === 'gym' ? 'Workout available' : 'Coming next'}</span>
            </div>
          </a>
        ))}
      </section>
      <aside className="course-note" aria-label="First course pack">
        <div className="course-label"><span className="course-dot" /> First course pack</div>
        <div><h2>{coursePack.title}</h2><p>From knowing how it works to writing it yourself.</p></div>
        <span className="course-status">{course.length} {course.length === 1 ? 'lesson' : 'lessons'} available</span>
      </aside>
    </>
  );
}

function AreaPage({ route }: { route: AreaId }) {
  const area = areas.find((item) => item.id === route)!;
  return (
    <section className={`area-page page-${area.id}`} aria-labelledby="area-heading">
      <a className="back-link" href="#/">← Back to home</a>
      <div className="area-detail">
        <div className="detail-copy">
          <p className="eyebrow">{area.verb}</p>
          <h1 id="area-heading">{area.title}</h1>
          <p className="detail-description">{area.detail}</p>
          <div className="coming-panel">
            <span className="availability">Coming next</span>
            <h2>This space is taking shape.</h2>
            <p>{area.upcoming}</p>
            <p className="muted">Learning activities will arrive in future milestones.</p>
          </div>
        </div>
        <Artwork area={area.id} />
      </div>
    </section>
  );
}

export function App() {
  const [route, setRoute] = useState(readRoute);
  const lessonRoute = parseLessonPath(route);
  const mainRef = useRef<HTMLElement>(null);
  const previousRoute = useRef(route);
  const { theme, toggleTheme, saveError } = useTheme();

  useEffect(() => {
    const navigate = (event: HashChangeEvent) => {
      if (!window.dispatchEvent(new Event('enntor:before-route-change', { cancelable: true }))) {
        window.history.replaceState(window.history.state, '', event.oldURL);
        return;
      }
      setRoute(readRoute());
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);

  useEffect(() => {
    const lessonRoute = parseLessonPath(route);
    const lesson = lessonRoute && course.find((item) => item.lesson.id === lessonRoute.id)?.lesson;
    const title = route === gymWorkoutPath ? 'The Gym · Workout' : route === gymResultsPath ? 'The Gym · Results'
      : lesson ? lessonRoute.results ? lesson.id + ' · Lesson report' : lesson.title
      : areas.find((area) => area.id === route)?.title ?? 'Make it your own.';
    document.title = `ENNTOR — ${title}`;
    if (previousRoute.current !== route) {
      mainRef.current?.focus();
      window.scrollTo(0, 0);
      previousRoute.current = route;
    }
  }, [route]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main" onClick={(event) => {
        event.preventDefault();
        mainRef.current?.focus();
        mainRef.current?.scrollIntoView();
      }}>Skip to content</a>
      <header className="site-header">
        <a className="brand" href="#/" aria-label="ENNTOR home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>ENNTOR<span className="brand-period">.</span></a>
        <nav aria-label="Main navigation">
          <a href="#/" aria-current={route === 'home' ? 'page' : undefined}>Home</a>
          {areas.map((area) => <a key={area.id} href={`#/${area.id}`} aria-current={route === area.id ? 'page' : lessonRoute && area.id === 'climb' ? 'location' : (route === gymWorkoutPath || route === gymResultsPath) && area.id === 'gym' ? 'location' : undefined}>{area.title}</a>)}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
        </button>
      </header>
      {saveError && <p className="save-warning" role="status">Your theme changed, but this browser couldn’t save it for your next visit.</p>}
      <main id="main" ref={mainRef} tabIndex={-1}>
        {route === 'home' ? <Home /> : (route === 'gym' || route === gymWorkoutPath || route === gymResultsPath) ? <Suspense fallback={<p role="status">Loading The Gym…</p>}><Gym view={route === gymWorkoutPath ? 'workout' : route === gymResultsPath ? 'results' : 'home'} /></Suspense> : route === 'climb' || lessonRoute ? <Climb route={lessonRoute} /> : <AreaPage route="room" />}
      </main>
      <footer className="site-footer"><p>Progress you can put to work.</p><p>ENNTOR <span aria-hidden="true">/</span> Learning pilot</p></footer>
    </div>
  );
}
