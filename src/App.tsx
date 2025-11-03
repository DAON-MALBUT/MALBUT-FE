import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from '@/pages/splash';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
