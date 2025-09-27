import React from "react";
import { Link, useOutletContext } from "react-router-dom";

function DashboardPage() {
  const { user } = useOutletContext();

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          marginBottom: '1rem',
          fontSize: '2.2rem'
        }}>
          Dashboard
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#27ae60',
          marginBottom: '2rem' 
        }}>
          Welcome back, <strong>{user?.fullName}</strong>!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Account Number</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {user?.accountNumber}
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#27ae60',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Account Status</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              Active & Secure
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#e67e22',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Last Login</h3>
            <p style={{ fontSize: '1rem' }}>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
            Quick Actions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link 
              to="/payments"
              style={{
                backgroundColor: '#e67e22',
                color: 'white',
                padding: '1rem',
                textDecoration: 'none',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Make International Payment
            </Link>
            
            <button 
              style={{
                backgroundColor: '#9b59b6',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => alert('Transaction history feature coming soon!')}
            >
              View Transaction History
            </button>
            
            <button 
              style={{
                backgroundColor: '#34495e',
                color: 'white',
                padding: '1rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => alert('Account settings feature coming soon!')}
            >
              Account Settings
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
            Security Status
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#d5f4e6',
              borderRadius: '6px',
              border: '1px solid #27ae60'
            }}>
              <strong style={{ color: '#27ae60' }}>✓ Secure Connection</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#155724' }}>
                Your session is protected with SSL encryption
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              backgroundColor: '#d5f4e6',
              borderRadius: '6px',
              border: '1px solid #27ae60'
            }}>
              <strong style={{ color: '#27ae60' }}>✓ Account Protected</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#155724' }}>
                Strong password and security measures active
              </p>
            </div>
            
            <div style={{
              padding: '1rem',
              backgroundColor: '#fff3cd',
              borderRadius: '6px',
              border: '1px solid #ffc107'
            }}>
              <strong style={{ color: '#856404' }}>⚠ Regular Security</strong>
              <p style={{ margin: '0.5rem 0 0', color: '#856404' }}>
                Remember to logout when finished
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;