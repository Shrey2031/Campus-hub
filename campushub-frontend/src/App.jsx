import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes";
import Home from "./pages/Home";
// import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
 import DiscussionPage from './pages/DiscussionPage';
 import UploadPage from './pages/UploadPage';
 import ResourcesPage from './pages/ResourcesPage';
 import AIChat from './components/AIChat';
 import ProfilePage from './pages/ProfilePage';
 import LandingPage from "./components/LandingPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/discussions" element={<DiscussionPage />} />
         <Route path="/upload-page" element={<UploadPage/>} />
       
        <Route path="/ai-chat" element={<AIChat />} />
         <Route path="/profile" element={<ProfilePage />} /> 
        
          <Route 
           path="/home" 
           element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
           } 
         />  
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

