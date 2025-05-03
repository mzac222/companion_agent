import { Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Home from './Pages/home';
import MentalHealthLandingPage from './Pages/LandingPage/Landing';
import AllArticlesPage from './Pages/LandingPage/AllArticles';
// import Register from './Pages/Register'; // Add this import
function App() {
  return (
    <Routes>
      <Route path="/" element={<MentalHealthLandingPage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> Add this route */}
      <Route path="/chat" element={<Home />} />
      <Route path="/chat/:id" element={<Home />} /> {/* Add this line */}
      <Route path="/all-articles" element={<AllArticlesPage />} /> {/* 👈 Fix: assign element */}

    </Routes>
  );
}

export default App;
