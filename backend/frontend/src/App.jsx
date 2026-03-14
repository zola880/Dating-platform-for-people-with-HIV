import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/AdminPanel';
import Resources from './pages/Resources';
import Groups from './pages/Groups';
import Events from './pages/Events';
import HealthTracker from './pages/HealthTracker';
import SwipeMatch from './pages/SwipeMatch';
import DatingPreferences from './pages/DatingPreferences';
import MyMatches from './pages/MyMatches';
import LikesReceived from './pages/LikesReceived';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resources" element={<Resources />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/swipe" element={<PrivateRoute><SwipeMatch /></PrivateRoute>} />
            <Route path="/my-matches" element={<PrivateRoute><MyMatches /></PrivateRoute>} />
            <Route path="/likes-received" element={<PrivateRoute><LikesReceived /></PrivateRoute>} />
            <Route path="/dating-preferences" element={<PrivateRoute><DatingPreferences /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/discover" element={<PrivateRoute><Discover /></PrivateRoute>} />
            <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/messages/:userId" element={<PrivateRoute><Messages /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/health" element={<PrivateRoute><HealthTracker /></PrivateRoute>} />
            
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
