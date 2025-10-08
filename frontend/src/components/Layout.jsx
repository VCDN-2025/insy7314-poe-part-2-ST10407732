import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

function Layout({ loggedIn, user, setLoggedIn, setUser, checkAuthStatus }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear state even if request fails
      setLoggedIn(false);
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      {/* Header/Navigation */}
      <nav style={{
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            🏦 International Payments Portal
          </Link>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {loggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/make-payment"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Make Payment
                </Link>
                <Link
                  to="/payments"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Payment History
                </Link>
                <span style={{ color: '#ecf0f1', fontSize: '0.9rem' }}>
                  {user?.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    backgroundColor: '#27ae60',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <Outlet context={{ loggedIn, user, setLoggedIn, setUser, checkAuthStatus }} />
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        marginTop: '4rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 International Payments Portal. All transactions are secured with SSL/TLS encryption.
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#95a5a6' }}>
          🔒 Your security is our priority
        </p>
      </footer>
    </div>
  );
}

export default Layout;