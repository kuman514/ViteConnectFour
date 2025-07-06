import { Outlet } from 'react-router';

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
    </main>
  );
}
