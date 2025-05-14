import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Forget from './pages/Auth/Forget';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ResetPassword from './pages/Auth/ResetPassword';
import UserDashboard from './pages/User/UserDashboard';
import AdminDashboard from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1200, // Increased for smoother animations
      delay: 100, // Slight delay for staggered effects
      once: true, // Animations trigger only once
      easing: 'ease-in-out', // Smooth animation curve
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        {/* Global styles */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * {
              box-sizing: border-box;
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<Forget />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute allowedRoles={['user', 'client']} />}>
            <Route path="/user" element={<UserDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;