import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CharacterList from './pages/character/list';
import CharacterInit from './pages/character/init';
import SplashPage from '@/pages/splash';
import Permission from './pages/permission';
import SignupInfo from './pages/signupInfo';
import Home from './pages/home';
import Settings from './pages/settings';
import Call from './pages/call';
import FAQ from './pages/faq';
import IncomingCall from './pages/incomingCall';
import Calling from './pages/calling';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/friends" element={<CharacterList />} />
        <Route path="/call" element={<Call />} />
        <Route path="/calling" element={<Calling />} />
        <Route path="/incoming-call" element={<IncomingCall />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/permission" element={<Permission />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/signup" element={<SignupInfo />} />
        <Route path='/character'>
          <Route index element={<CharacterList />} />
          <Route path='init' element={<CharacterInit />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
