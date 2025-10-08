import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { getProtected } from "./services/api";

// Global styles
const globalStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: 0,
    backgroundColor: '#f8f9fa',
    lineHeight: 1.6
  }
};

// Apply global styles
Object.assign(document.body.style, globalStyles.body);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await getProtected();
      setLoggedIn(true);
      setUser(response.data.user);
    } catch (err) {
      console.log("Not authenticated");
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem',
        color: '#7f8c8d'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout 
                loggedIn={loggedIn} 
                user={user} 
                setLoggedIn={setLoggedIn} 
                setUser={setUser}
                checkAuthStatus={checkAuthStatus}
              />
            }
          >
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route 
              path="login" 
              element={loggedIn ? <Navigate to="/dashboard" /> : <LoginPage />} 
            />
            <Route 
              path="register" 
              element={loggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />} 
            />
            
            {/* Protected routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="make-payment"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="payments"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            
            {/* 404 route */}
            <Route 
              path="*" 
              element={
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  margin: '2rem'
                }}>
                  <h1 style={{ color: '#e74c3c' }}>404 - Page Not Found</h1>
                  <p style={{ color: '#7f8c8d' }}>The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;