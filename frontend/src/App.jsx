import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Forget from './pages/Auth/Forget';
import VerifyOTP from './pages/Auth/VerifyOTP';
import UserDashboard from './pages/User';
import AdminDashboard from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import GenerateCSR from './pages/GenerateCSR';

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
          <Route path="/generate-csr" element={<GenerateCSR />} />

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