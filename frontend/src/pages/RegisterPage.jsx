import React from "react";
import { Link } from "react-router-dom";
import Register from "../components/Register";

function RegisterPage() {
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
            Create Your Account
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: '0.95',
            margin: 0
          }}>
            Join thousands of users making secure international payments
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Register Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <Register />
        </div>

        {/* Login CTA Card */}
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
            Already have an account?
          </p>
          
          <Link
            to="/login"
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '1rem 2.5rem',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
          >
            Login Here →
          </Link>
        </div>

        {/* Security Requirements Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          borderLeft: '4px solid #27ae60'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>✓</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                color: '#155724', 
                marginBottom: '1rem',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Security Requirements
              </h4>
              <ul style={{ 
                color: '#155724', 
                fontSize: '1rem', 
                margin: 0,
                paddingLeft: '1.5rem',
                lineHeight: '2'
              }}>
                <li>All fields marked with * are required</li>
                <li>ID Number must be exactly 13 digits</li>
                <li>Account Number must be 6-20 digits</li>
                <li>Password must contain uppercase, lowercase, number, and special character</li>
                <li>All input is validated and sanitized for security</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Registration Benefits */}
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
            What You'll Get
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌍</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem', fontWeight: '500' }}>
                Global Payments
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem', fontWeight: '500' }}>
                Instant Transfers
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem', fontWeight: '500' }}>
                Bank-Level Security
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ color: '#6c757d', fontSize: '0.9rem', fontWeight: '500' }}>
                Transaction History
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;