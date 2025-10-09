import React from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      marginTop: '-2rem', 
      marginLeft: '-2rem', 
      marginRight: '-2rem',
      paddingTop: '3rem',
      paddingBottom: '3rem'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <svg width="100" height="100" viewBox="0 0 1024 1024" style={{ margin: '0 auto', display: 'block' }}>
              <rect width="1024" height="1024" rx="200" fill="#1E88E5"/>
              <g transform="translate(200, 200)">
                <rect x="0" y="0" width="624" height="400" rx="40" fill="white"/>
                <rect x="0" y="0" width="624" height="120" rx="40" fill="white"/>
                <rect x="80" y="200" width="200" height="40" rx="20" fill="#1E88E5"/>
              </g>
            </svg>
          </div>

          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: '0.95',
            margin: 0
          }}>
            Login to access your secure payment portal
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Login Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <Login />
        </div>

        {/* Register CTA Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <p style={{
            color: '#6c757d',
            marginBottom: '1.5rem',
            fontSize: '1.1rem'
          }}>
            Don't have an account?
          </p>
          
          <Link
            to="/register"
            style={{
              backgroundColor: '#27ae60',
              color: 'white',
              padding: '1rem 2.5rem',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
          >
            Create New Account →
          </Link>
        </div>

        {/* Security Notice Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #ffc107'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <div>
              <h4 style={{ 
                color: '#856404', 
                marginBottom: '0.75rem',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Security Notice
              </h4>
              <p style={{ 
                color: '#856404', 
                fontSize: '1rem', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                After 5 failed login attempts, your account will be temporarily locked for 15 minutes for security purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#1e3c72',
            fontSize: '1.3rem',
            marginBottom: '1.5rem',
            fontWeight: '600'
          }}>
            Your Security is Our Priority
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                SSL Encrypted
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Protected Data
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Rate Limited
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;