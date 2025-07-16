import { GridTileStatus } from '^/entities/grid-tile/types';

interface Props {
  winner: GridTileStatus;
}

export default function ResultScreen({ winner }: Props) {
  const renderWinner =
    winner === GridTileStatus.EMPTY ? null : (
      <div className="fade-out-animation opacity-0 fixed left-0 top-0 right-0 bottom-0 w-screen h-dvh pointer-events-none bg-black/50 flex justify-center items-center font-bold text-4xl text-white">
        <span className="big-breathe-animation">Player {winner} wins!</span>
      </div>
    );

  return renderWinner;
}
