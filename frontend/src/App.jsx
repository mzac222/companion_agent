import { Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Home from './Pages/home';
import HistoryPage from './Pages/HistoryPage';// In App.js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Home />} />
      <Route path="/chat/:id" element={<Home />} /> {/* Add this line */}
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}

export default App;
