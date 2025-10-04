interface Props {
  children: string;
}

export default function Title({ children }: Props) {
  return (
    <h1 aria-label="title" className="text-base sm:text-4xl font-bold">
      {children}
    </h1>
  );
}
