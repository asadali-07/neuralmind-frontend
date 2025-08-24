import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import LoadingSpinner from "./components/LoadingSpinner";
import useAuthStore from "./store/authStore";

const App = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check auth status on component mount
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white ">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <div className="App bg-white ">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <Register />
            }
          />
          <Route
            path="/chat"
            element={
              isAuthenticated ? <Chat /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
