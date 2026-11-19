import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTheme } from '../platform/useTheme';
import { PilotLesson, pilotTitle } from '../learning/PilotLesson';
import { areas, pilotPath, pilotResultsPath, readRoute } from './areas';
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
              <span className="availability">{area.id === 'climb' ? 'Pilot available' : area.id === 'gym' ? 'Workout available' : 'Coming next'}</span>
            </div>
          </a>
        ))}
      </section>
      <aside className="course-note" aria-label="First course pack">
        <div className="course-label"><span className="course-dot" /> First course pack</div>
        <div><h2>Python &amp; AI interview skills</h2><p>From knowing how it works to writing it yourself.</p></div>
        <span className="course-status">One pilot lesson</span>
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
          {route === 'climb' ? (
            <div className="coming-panel">
              <span className="availability">One pilot lesson</span>
              <h2>F01.01 · {pilotTitle}</h2>
              <p>Practise the lesson and run real Python. This pilot sits outside curriculum progression.</p>
              <a className="pilot-link" href={`#/${pilotPath}`}>Open pilot lesson →</a>
            </div>
          ) : <div className="coming-panel">
            <span className="availability">Coming next</span>
            <h2>This space is taking shape.</h2>
            <p>{area.upcoming}</p>
            <p className="muted">This release includes navigation and appearance settings. Learning activities will arrive in future milestones.</p>
          </div>}
        </div>
        <Artwork area={area.id} />
      </div>
    </section>
  );
}

export function App() {
  const [route, setRoute] = useState(readRoute);
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
    const title = route === pilotResultsPath ? 'F01.01 · Lesson report' : route === pilotPath ? pilotTitle : areas.find((area) => area.id === route)?.title ?? 'Make it your own.';
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
          {areas.map((area) => <a key={area.id} href={`#/${area.id}`} aria-current={route === area.id ? 'page' : (route === pilotPath || route === pilotResultsPath) && area.id === 'climb' ? 'location' : undefined}>{area.title}</a>)}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
        </button>
      </header>
      {saveError && <p className="save-warning" role="status">Your theme changed, but this browser couldn’t save it for your next visit.</p>}
      <main id="main" ref={mainRef} tabIndex={-1}>
        {route === 'home' ? <Home /> : route === 'gym' ? <Suspense fallback={<p role="status">Loading The Gym…</p>}><Gym /></Suspense> : route === pilotPath || route === pilotResultsPath ? <PilotLesson results={route === pilotResultsPath} /> : <AreaPage route={route} />}
      </main>
      <footer className="site-footer"><p>Progress you can put to work.</p><p>ENNTOR <span aria-hidden="true">/</span> Learning pilot</p></footer>
    </div>
  );
}
