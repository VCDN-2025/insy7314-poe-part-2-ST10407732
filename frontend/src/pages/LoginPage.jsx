import React from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ 
        color: '#2c3e50', 
        marginBottom: '2rem',
        fontSize: '2rem'
      }}>
        Login to Your Account
      </h1>
      
      <Login />
      
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#white',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '2rem auto 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <p style={{ 
          color: '#7f8c8d',
          marginBottom: '1rem'
        }}>
          Don't have an account?
        </p>
        
        <Link 
          to="/register"
          style={{
            backgroundColor: '#27ae60',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Register Here
        </Link>
      </div>
      
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '6px',
        maxWidth: '500px',
        margin: '2rem auto 0'
      }}>
        <h4 style={{ color: '#856404', marginBottom: '0.5rem' }}>
          Security Notice
        </h4>
        <p style={{ color: '#856404', fontSize: '0.9rem', margin: '0' }}>
          After 5 failed login attempts, your account will be locked for 15 minutes for security purposes.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;