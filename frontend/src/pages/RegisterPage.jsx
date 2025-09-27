import React from "react";
import { Link } from "react-router-dom";
import Register from "../components/Register";

function RegisterPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ 
        color: '#2c3e50', 
        marginBottom: '2rem',
        fontSize: '2rem'
      }}>
        Create Your Account
      </h1>
      
      <Register />
      
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '2rem auto 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <p style={{ 
          color: '#7f8c8d',
          marginBottom: '1rem'
        }}>
          Already have an account?
        </p>
        
        <Link 
          to="/login"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Login Here
        </Link>
      </div>
      
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '6px',
        maxWidth: '500px',
        margin: '2rem auto 0',
        textAlign: 'left'
      }}>
        <h4 style={{ color: '#155724', marginBottom: '1rem' }}>
          Security Requirements
        </h4>
        <ul style={{ color: '#155724', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
          <li>All fields marked with * are required</li>
          <li>ID Number must be exactly 13 digits</li>
          <li>Account Number must be 6-20 digits</li>
          <li>Password must contain uppercase, lowercase, number, and special character</li>
          <li>All input is validated and sanitized for security</li>
        </ul>
      </div>
    </div>
  );
}

export default RegisterPage;