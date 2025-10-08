import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { setLoggedIn, setUser, checkAuthStatus } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Client-side validation
    if (!/^\d{6,20}$/.test(accountNumber)) {
      setError("Account number must be 6-20 digits");
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Attempting login...");
      const response = await loginUser({ accountNumber, password });
      console.log("Login response:", response.data);
      
      // Update state immediately
      setLoggedIn(true);
      setUser(response.data.user);
      
      // Optionally refresh auth status
      if (checkAuthStatus) {
        await checkAuthStatus();
      }
      
      // Navigate to dashboard
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
      
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Account Number *
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 20) {
                setAccountNumber(value);
              }
            }}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your account number"
            maxLength="20"
          />
          <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
            6-20 digits only
          </small>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your password"
            maxLength="128"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: loading ? '#95a5a6' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        {error && (
          <div style={{ 
            color: '#721c24', 
            marginTop: '1rem',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;