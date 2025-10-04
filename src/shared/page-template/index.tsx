import { Link, Outlet } from 'react-router';

export default function PageTemplate() {
  return (
    <main
      aria-label="page"
      className="w-screen h-dvh flex justify-center items-center"
    >
      <section
        aria-label="page-body"
        className="w-full h-full max-w-[100dvh] max-h-[100vw] aspect-square"
      >
        <Outlet />
      </section>
      <section className="fixed left-0 top-0 w-full flex flex-col justify-center items-center py-8">
        <nav>
          <ul className="flex flex-row gap-4">
            <li>
              <Link to="/">Game</Link>
            </li>
            <li>
              <Link to="/replay">Replay</Link>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  );
}
