import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* Future protected routes */}
            <Route
              path="payments"
              element={
                <ProtectedRoute>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    margin: '2rem'
                  }}>
                    <h1 style={{ color: '#2c3e50' }}>International Payments</h1>
                    <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
                      Secure payment portal coming soon!
                    </p>
                    <div style={{
                      padding: '2rem',
                      backgroundColor: '#e8f6f3',
                      borderRadius: '6px',
                      marginTop: '2rem'
                    }}>
                      <h3 style={{ color: '#27ae60' }}>Features in Development:</h3>
                      <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                        <li>SWIFT international transfers</li>
                        <li>Multi-currency support</li>
                        <li>Real-time exchange rates</li>
                        <li>Transaction tracking</li>
                        <li>Compliance verification</li>
                      </ul>
                    </div>
                  </div>
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