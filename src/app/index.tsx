import { BrowserRouter, Route, Routes } from 'react-router';

import GamePage from '^/pages/game';
import ReplayPage from '^/pages/replay';
import PageTemplate from '^/shared/page-template';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageTemplate />}>
          <Route index element={<GamePage />} />
          <Route path="replay" element={<ReplayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
