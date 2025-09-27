import React from "react";
import { Link, useOutletContext } from "react-router-dom";

function HomePage() {
  const { loggedIn, user } = useOutletContext();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '3rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          marginBottom: '1rem',
          fontSize: '2.5rem' 
        }}>
          Welcome to SecureBank International
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#7f8c8d',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Your trusted partner for secure international payments and banking services.
        </p>

        {loggedIn ? (
          <div>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#27ae60',
              marginBottom: '2rem' 
            }}>
              Welcome back, <strong>{user?.fullName}</strong>!
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/dashboard"
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '1rem 2rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Go to Dashboard
              </Link>
              
              <Link 
                to="/payments"
                style={{
                  backgroundColor: '#e67e22',
                  color: 'white',
                  padding: '1rem 2rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Make International Payment
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#34495e',
              marginBottom: '2rem' 
            }}>
              Please login or register to access our secure banking services.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/login"
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '1rem 2rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Login
              </Link>
              
              <Link 
                to="/register"
                style={{
                  backgroundColor: '#27ae60',
                  color: 'white',
                  padding: '1rem 2rem',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Register
              </Link>
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#ecf0f1',
          borderRadius: '6px'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
            Security Features
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div>
              <strong>🔒 SSL Encryption</strong>
              <p>All data transmitted over secure HTTPS</p>
            </div>
            <div>
              <strong>🛡️ Input Validation</strong>
              <p>Comprehensive input sanitization</p>
            </div>
            <div>
              <strong>🔐 Secure Authentication</strong>
              <p>Password hashing and salting</p>
            </div>
            <div>
              <strong>⚡ Rate Limiting</strong>
              <p>Protection against brute force attacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;