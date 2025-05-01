import { Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Home from './Pages/home';
import HistoryPage from './Pages/HistoryPage';// In App.js
import MentalHealthLandingPage from './Pages/LandingPage/Landing';
function App() {
  return (
    <Routes>
      <Route path="/" element={<MentalHealthLandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Home />} />
      <Route path="/chat/:id" element={<Home />} /> {/* Add this line */}
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}

export default App;
