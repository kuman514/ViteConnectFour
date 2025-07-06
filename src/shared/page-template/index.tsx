import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageTemplate({ children }: Props) {
  return (
    <main
      aria-label="page"
      className="w-screen h-dvh flex justify-center items-center"
    >
      <section
        aria-label="page-body"
        className="w-full h-full max-w-[100dvh] max-h-[100vw] aspect-square"
      >
        {children}
      </section>
    </main>
  );
}
