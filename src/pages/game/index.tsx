import GridTile from '^/entities/grid-tile';
import { COLS, ROWS } from '^/entities/grid-tile/constants';
import {
  GridTileStatus,
  type ColRange,
  type RowRange,
} from '^/entities/grid-tile/types';
import { useGameStore } from '^/features/game/store';
import ResultScreen from '^/features/result-screen';
import Title from '^/shared/title';
import UIButton from '^/shared/ui-button';

export default function GamePage() {
  const {
    tiles,
    currentPlayer,
    history,
    winner,
    winnerRange,
    deployToCol,
    undo,
    reset,
  } = useGameStore();

  const isDraw =
    history.length === ROWS * COLS && winner === GridTileStatus.EMPTY;

  const renderPlayStatus =
    winner !== GridTileStatus.EMPTY || isDraw ? (
      <span aria-label="result">
        {isDraw ? 'Draw!' : `Player ${winner} wins!`}
      </span>
    ) : (
      <span aria-label="current-turn">Player {currentPlayer}'s turn...</span>
    );

  const renderTiles = (
    <div
      className="w-[70%] h-[60%] grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      }}
      onClick={(event) => {
        if (!(event.target instanceof HTMLButtonElement)) {
          return;
        }
        const rowColPair = event.target.id.split('grid-tile-')[1];
        const [, col] = rowColPair
          .split('-')
          .map((rawValue) => parseInt(rawValue));
        deployToCol(col as ColRange);
      }}
    >
      {Array.from({ length: COLS }, (_, j) => (
        <div
          key={`column-${j}`}
          className="w-full h-full grid hover:bg-gray-300"
          style={{
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: ROWS }, (_, i) => (
            <GridTile
              key={`${i}-${j}`}
              row={i as RowRange}
              col={j as ColRange}
              isDisabled={winner !== GridTileStatus.EMPTY}
              isHighlighted={
                winner !== GridTileStatus.EMPTY &&
                winnerRange.some(
                  (coords) => coords.row === i && coords.col === j
                )
              }
              status={tiles[i][j]}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <Title>ViteConnectFour Game</Title>
      {renderPlayStatus}
      {renderTiles}
      <div className="flex flex-row gap-4">
        <UIButton
          ariaLabel="undo"
          isDisabled={
            history.length === 0 || winner !== GridTileStatus.EMPTY || isDraw
          }
          onClick={() => {
            undo();
          }}
        >
          Undo
        </UIButton>
        <UIButton
          ariaLabel="reset"
          isDisabled={history.length === 0}
          onClick={() => {
            reset();
          }}
        >
          Reset
        </UIButton>
      </div>
      <ResultScreen winner={winner} />
    </div>
  );
}
