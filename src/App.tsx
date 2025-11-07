import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CharacterList from './pages/character/list';
import CharacterInit from './pages/character/init';
import CharacterCreate from './pages/character/create';
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
        <Route path='/character'>
          <Route index element={<CharacterList />} />
          <Route path='init' element={<CharacterInit />} />
          <Route path='create' element={<CharacterCreate />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
