// App.jsx - Put BrowserRouter HERE
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/auth" element={<AuthPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App