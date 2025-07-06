import type { ReactNode } from 'react';

interface Props {
  ariaLabel: string;
  children: ReactNode;
  isDisabled?: boolean;
  onClick: () => void;
}

export default function UIButton({
  ariaLabel,
  children,
  isDisabled,
  onClick,
}: Props) {
  return (
    <button
      aria-label={ariaLabel}
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className="bg-green-500 text-white py-4 px-6 hover:bg-green-300 rounded-full disabled:bg-gray-300 cursor-pointer disabled:cursor-auto"
    >
      {children}
    </button>
  );
}
