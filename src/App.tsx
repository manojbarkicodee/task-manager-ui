import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
// import TaskManager from './pages/TaskManager';
import Login from './pages/Login';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import TaskManager from './pages/Taskmanager';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn); // Get login state from Redux

  return (
    <Router>
      <Routes>
        {/* Protected Route */}
        <Route 
          path="/task-manager" 
          element={isLoggedIn ? <TaskManager /> : <Navigate to="/" replace />} 
        />
        
        {/* Login Page */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/task-manager" replace /> : <Login />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
