import React from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { loggedIn } = useOutletContext();
  
  // If not logged in, redirect to login page
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in, render the protected component
  return children;
}

export default ProtectedRoute;