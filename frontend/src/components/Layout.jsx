import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/api";

function Layout({ loggedIn, user, setLoggedIn, setUser, checkAuthStatus }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('token');
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      style={{
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        backgroundColor: isActive(to) ? 'rgba(255,255,255,0.15)' : 'transparent',
        transition: 'all 0.3s',
        display: 'inline-block'
      }}
      onMouseEnter={(e) => {
        if (!isActive(to)) {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive(to)) {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      {children}
    </Link>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      {/* Header/Navigation */}
      <nav style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem 2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Logo */}
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                background: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}>
                💳
              </div>
              <div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  letterSpacing: '-0.5px'
                }}>
                  PAYMENTS PORTAL
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: '0.9',
                  letterSpacing: '2px',
                  fontWeight: '500'
                }}>
                  SECURE • GLOBAL • INSTANT
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {loggedIn ? (
                <>
                  <NavLink to="/dashboard">
                    📊 Dashboard
                  </NavLink>
                  <NavLink to="/make-payment">
                    💰 Make Payment
                  </NavLink>
                  <NavLink to="/payments">
                    📜 History
                  </NavLink>
                  
                  {/* User Info Badge */}
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    marginLeft: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ 
                      color: 'white', 
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      👤 {user?.fullName}
                    </div>
                    <div style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      fontSize: '0.7rem',
                      marginTop: '2px'
                    }}>
                      Acc: {user?.accountNumber}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '0.65rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginLeft: '0.5rem',
                      boxShadow: '0 2px 8px rgba(231,76,60,0.3)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c0392b';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(231,76,60,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#e74c3c';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(231,76,60,0.3)';
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">
                    🔐 Login
                  </NavLink>
                  <Link
                    to="/register"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      color: '#1e3c72',
                      padding: '0.65rem 1.5rem',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginLeft: '0.5rem',
                      boxShadow: '0 2px 8px rgba(255,255,255,0.3)',
                      transition: 'all 0.3s',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(255,255,255,0.3)';
                    }}
                  >
                    ✨ Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <Outlet context={{ loggedIn, user, setLoggedIn, setUser, checkAuthStatus }} />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '3rem 2rem'
        }}>
          {/* Footer Top - Info Sections */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}>
            {/* About Section */}
            <div>
              <h4 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                🏦 About Us
              </h4>
              <p style={{ 
                margin: 0, 
                lineHeight: '1.8',
                opacity: '0.9',
                fontSize: '0.95rem'
              }}>
                Your trusted partner for secure international payments. We provide enterprise-grade security with bank-level encryption for all transactions worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                🔗 Quick Links
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <Link to="/" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem' }}>
                  → Home
                </Link>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem' }}>
                  → Login
                </Link>
                <Link to="/register" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem' }}>
                  → Register
                </Link>
                {loggedIn && (
                  <>
                    <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem' }}>
                      → Dashboard
                    </Link>
                    <Link to="/make-payment" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem' }}>
                      → Make Payment
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Security Features */}
            <div>
              <h4 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                🔒 Security
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>
                <div style={{ opacity: '0.9' }}>✓ SSL/TLS Encryption</div>
                <div style={{ opacity: '0.9' }}>✓ Password Hashing & Salting</div>
                <div style={{ opacity: '0.9' }}>✓ Input Validation</div>
                <div style={{ opacity: '0.9' }}>✓ Rate Limiting Protection</div>
                <div style={{ opacity: '0.9' }}>✓ DevSecOps Pipeline</div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ 
                fontSize: '1.2rem', 
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                📞 Support
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.95rem',
                opacity: '0.9'
              }}>
                <div>📧 support@paymentsportal.com</div>
                <div>📱 +27 (0) 11 123 4567</div>
                <div>🕐 24/7 Customer Support</div>
                <div>🌍 150+ Countries</div>
              </div>
            </div>
          </div>

          {/* Footer Bottom - Copyright & Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.95rem',
                opacity: '0.9'
              }}>
                © 2025 International Payments Portal. All rights reserved.
              </p>
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                fontSize: '0.85rem',
                opacity: '0.8'
              }}>
                Built with enterprise-grade security • Powered by SWIFT Network
              </p>
            </div>

            {/* Trust Badges */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                🔒 SSL Secured
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                ✓ PCI Compliant
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                🛡️ Bank-Grade Security
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem',
              lineHeight: '1.6',
              opacity: '0.95'
            }}>
              <strong>🔐 Your Security is Our Priority:</strong> All transactions are encrypted with 256-bit SSL/TLS. 
              We never store sensitive payment information. Your data is protected by multiple layers of security 
              including input validation, password hashing, and continuous monitoring.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;