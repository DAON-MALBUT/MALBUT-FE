import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from '@/pages/splash';
import Permission from './pages/permission';
import SignupInfo from './pages/signupInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/permission" element={<Permission />} />
        <Route path="/signup" element={<SignupInfo />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
