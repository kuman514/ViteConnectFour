import { CIRCLE_COLOR } from './constants';
import type { ColRange, GridTileStatus, RowRange } from './types';

interface Props {
  row: RowRange;
  col: ColRange;
  status: GridTileStatus;
  isDisabled: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function GridTile({
  row,
  col,
  status,
  isDisabled,
  onClick,
}: Props) {
  return (
    <button
      aria-label={`grid-tile-${row}-${col}`}
      id={`grid-tile-${row}-${col}`}
      type="button"
      className="w-full h-full p-[10%] aspect-square cursor-pointer disabled:cursor-auto"
      disabled={isDisabled}
      onClick={onClick}
    >
      <div
        aria-label={`grid-circle-${row}-${col}`}
        className="w-full h-full pointer-events-none rounded-full bg-red-500"
        style={{
          backgroundColor: CIRCLE_COLOR[status],
        }}
      ></div>
    </button>
  );
}
