import { BrowserRouter, Routes } from 'react-router';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route element={<RootLayout />}>
          <Route index element={<GamePage />} />
          <Route path="/create" element={<ReplayPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
