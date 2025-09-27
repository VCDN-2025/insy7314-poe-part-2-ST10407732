import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getProtected, logoutUser } from "../services/api";

export default function Layout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await getProtected();
      setLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {
      setLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      setLoggedIn(false);
      setUser(null);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ 
        backgroundColor: '#2c3e50', 
        padding: '1rem 2rem', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            SecureBank International
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Home
            </Link>
            
            {loggedIn ? (
              <>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <Link to="/payments" style={{ color: 'white', textDecoration: 'none' }}>
                  International Payments
                </Link>
                <div style={{ color: '#ecf0f1', fontSize: '0.9rem' }}>
                  Welcome, {user?.fullName}
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ padding: '0 2rem' }}>
        <Outlet context={{ loggedIn, setLoggedIn, user, setUser, checkAuthStatus }} />
      </div>
    </div>
  );
}