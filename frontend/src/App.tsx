import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import CoTListPage from './pages/CoTListPage';
import CoTDetailPage from './pages/CoTDetailPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CoTListPage />} />
          <Route path="cot-list" element={<CoTListPage />} />
          <Route path="cot/:id" element={<CoTDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;