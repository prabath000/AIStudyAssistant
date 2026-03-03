import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import NotesGenerator from './pages/NotesGenerator';
import DocumentDetails from './pages/DocumentDetails';
import OAuthCallback from './pages/OAuthCallback';
import WritingTools from './pages/WritingTools';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Settings from './pages/Settings';
import QuizGenerator from './pages/QuizGenerator';
import StudyPlanner from './pages/StudyPlanner';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/chat" element={
              <PrivateRoute>
                <AIChat />
              </PrivateRoute>
            } />
            <Route path="/notes" element={
              <PrivateRoute>
                <NotesGenerator />
              </PrivateRoute>
            } />
            <Route path="/document/:id" element={
              <PrivateRoute>
                <DocumentDetails />
              </PrivateRoute>
            } />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/writing-tools" element={
              <PrivateRoute>
                <WritingTools />
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            } />
            <Route path="/support" element={
              <PrivateRoute>
                <Support />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/quiz" element={
              <PrivateRoute>
                <QuizGenerator />
              </PrivateRoute>
            } />
            <Route path="/planner" element={
              <PrivateRoute>
                <StudyPlanner />
              </PrivateRoute>
            } />
            {/* Redirect all other paths to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

