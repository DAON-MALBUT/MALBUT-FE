import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileLayout from './layouts/mobile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MobileLayout>Home Page</MobileLayout>} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
