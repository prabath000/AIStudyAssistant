import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import NotesGenerator from './pages/NotesGenerator';
import QuizGenerator from './pages/QuizGenerator';
import StudyPlanner from './pages/StudyPlanner';
import DocumentDetails from './pages/DocumentDetails';

const PrivateRoute = ({ children }) => {

  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
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
          <Route path="/document/:id" element={
            <PrivateRoute>
              <DocumentDetails />
            </PrivateRoute>
          } />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

