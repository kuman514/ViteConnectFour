import { useEffect, useRef, useState } from 'react';

import GridTile from '^/entities/grid-tile';
import { COLS, ROWS } from '^/entities/grid-tile/constants';
import {
  GridTileStatus,
  type ColRange,
  type HistoryNode,
  type RowRange,
} from '^/entities/grid-tile/types';
import { useGameStore } from '^/features/game/store';
import Title from '^/shared/title';
import UIButton from '^/shared/ui-button';

export default function ReplayPage() {
  const { tiles, winner, winnerRange, deployToCol, undo, reset } =
    useGameStore();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loadedHistory, setLoadedHistory] = useState<HistoryNode[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  function loadHistory(newHistory: HistoryNode[]) {
    reset();
    setCurrentPage(0);
    setLoadedHistory(newHistory);
  }

  const renderTiles = (
    <div
      className="w-[70%] h-[60%] grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
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
              isDisabled
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

  const renderPage =
    loadedHistory.length > 0 ? (
      <span aria-label="pages">
        {currentPage} / {loadedHistory.length}
      </span>
    ) : (
      <span>Load a replay file.</span>
    );

  useEffect(() => {
    reset();
    return () => {
      setCurrentPage(0);
      setLoadedHistory([]);
      reset();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      <Title>ViteConnectFour Replay</Title>
      {renderTiles}
      <div className="flex flex-row justify-center items-center gap-4">
        <UIButton
          ariaLabel="prev"
          isDisabled={currentPage <= 0}
          onClick={() => {
            undo();
            setCurrentPage(currentPage - 1);
          }}
        >
          Prev
        </UIButton>
        {renderPage}
        <UIButton
          ariaLabel="next"
          isDisabled={currentPage >= loadedHistory.length}
          onClick={() => {
            deployToCol(loadedHistory[currentPage].coords.col);
            setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </UIButton>
      </div>
      <div className="flex flex-row">
        <UIButton
          ariaLabel="load-replay"
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          Load replay
        </UIButton>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          id="replay-file"
          name="replay-file"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target instanceof HTMLInputElement) {
              const { files } = event.target;
              if (!files || files.length <= 0) {
                return;
              }
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                const result = JSON.parse(reader.result as string);

                if (result.rows !== ROWS || result.cols !== COLS) {
                  return;
                }

                if (result.history === null || result.history === undefined) {
                  return;
                }

                loadHistory(result.history);
              });

              reader.readAsText(files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
