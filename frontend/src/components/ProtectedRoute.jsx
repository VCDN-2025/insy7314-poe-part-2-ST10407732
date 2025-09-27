import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getProtected } from "../services/api";

function ProtectedRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getProtected();
      setAuthorized(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthorized(false);
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
        height: '50vh' 
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    // Redirect to login page but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;