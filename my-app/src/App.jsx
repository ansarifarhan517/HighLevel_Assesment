import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { useAuth } from './context/AuthContext' // Import the useAuth hook

import './App.css'

function App() {
  const { isUserLoggedIn, setIsUserLoggedIn } = useAuth(); // Consume state from context

  return (
    <Router>
      <Routes>
        {/* If the user is logged in and tries to access /login, redirect them to the dashboard */}
        {/* Login component will now use useAuth() internally to set isUserLoggedIn */}
        <Route path="/login" element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsUserLoggedIn={setIsUserLoggedIn} />} />
        {/* If the user is logged in and tries to access /register, you might redirect them or still show register */}
        <Route path="/register" element={isUserLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route
          path="/dashboard"
          // Dashboard component will now use useAuth() internally for logout
          element={isUserLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Default route: if logged in, go to dashboard, otherwise go to login page */}
        <Route path="/" element={<Navigate to={isUserLoggedIn ? "/dashboard" : "/login"} />} />
        {/* You could add a 404 Not Found route here as well */}
        {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
      </Routes>
    </Router>
  )
}

export default App
