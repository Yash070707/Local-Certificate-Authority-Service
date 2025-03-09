import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Forget from './pages/Auth/Forget';
import VerifyOTP from './pages/Auth/VerifyOTP';
import UserDashboard from './pages/User';
import AdminDashboard from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<Forget />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
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