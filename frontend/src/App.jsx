import { Routes, Route } from 'react-router-dom';
import Login from './Pages/login';
import Home from './Pages/home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
    </Routes>
  );
}

export default App;
