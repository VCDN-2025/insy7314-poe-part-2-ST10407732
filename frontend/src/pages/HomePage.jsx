import React from "react";
import { Link, useOutletContext } from "react-router-dom";

function HomePage() {
  const { loggedIn, user } = useOutletContext();

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', marginTop: '-2rem', marginLeft: '-2rem', marginRight: '-2rem' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <svg width="120" height="120" viewBox="0 0 1024 1024" style={{ margin: '0 auto', display: 'block' }}>
              <rect width="1024" height="1024" rx="200" fill="#1E88E5"/>
              <g transform="translate(200, 200)">
                <rect x="0" y="0" width="624" height="400" rx="40" fill="white"/>
                <rect x="0" y="0" width="624" height="120" rx="40" fill="white"/>
                <rect x="80" y="200" width="200" height="40" rx="20" fill="#1E88E5"/>
              </g>
            </svg>
          </div>

          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            PAYMENTS PORTAL
          </h1>
          
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '2.5rem',
            opacity: '0.95',
            maxWidth: '700px',
            margin: '0 auto 2.5rem'
          }}>
            Your trusted platform for secure international payments and banking services worldwide
          </p>

          {loggedIn ? (
            <div>
              <p style={{ 
                fontSize: '1.2rem', 
                marginBottom: '2rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '1rem',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                Welcome back, <strong>{user?.fullName}</strong>!
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '1.5rem'
              }}>
                <Link 
                  to="/dashboard"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3c72',
                    padding: '1rem 2.5rem',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'inline-block'
                  }}
                >
                  Go to Dashboard →
                </Link>
                
                <Link 
                  to="/make-payment"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '1rem 2.5rem',
                    textDecoration: 'none',
                    border: '2px solid white',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}
                >
                  Make Payment
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link 
                  to="/login"
                  style={{
                    backgroundColor: 'white',
                    color: '#1e3c72',
                    padding: '1rem 2.5rem',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'inline-block'
                  }}
                >
                  Login
                </Link>
                
                <Link 
                  to="/register"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '1rem 2.5rem',
                    textDecoration: 'none',
                    border: '2px solid white',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}
                >
                  Register Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#1e3c72',
          fontSize: '2.5rem',
          marginBottom: '3rem',
          fontWeight: '700'
        }}>
          Why Choose Our Payment Portal?
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'transform 0.3s'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem'
            }}>🌍</div>
            <h3 style={{ 
              color: '#1e3c72',
              marginBottom: '0.5rem',
              fontSize: '1.4rem'
            }}>
              Global Reach
            </h3>
            <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
              Send and receive payments in 150+ countries with competitive exchange rates and fast processing
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem'
            }}>⚡</div>
            <h3 style={{ 
              color: '#1e3c72',
              marginBottom: '0.5rem',
              fontSize: '1.4rem'
            }}>
              Instant Transfers
            </h3>
            <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
              Complete international transactions in minutes with real-time processing and tracking
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem'
            }}>🔒</div>
            <h3 style={{ 
              color: '#1e3c72',
              marginBottom: '0.5rem',
              fontSize: '1.4rem'
            }}>
              Bank-Level Security
            </h3>
            <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
              Your data protected with industry-leading encryption and security protocols
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ 
            color: '#1e3c72',
            fontSize: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            Enterprise-Grade Security Features
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #1e3c72'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔐</span>
                <strong style={{ color: '#1e3c72', fontSize: '1.1rem' }}>
                  SSL/TLS Encryption
                </strong>
              </div>
              <p style={{ color: '#6c757d', margin: 0 }}>
                All data transmitted over secure HTTPS with 256-bit encryption standards
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #1e3c72'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🛡️</span>
                <strong style={{ color: '#1e3c72', fontSize: '1.1rem' }}>
                  Input Validation
                </strong>
              </div>
              <p style={{ color: '#6c757d', margin: 0 }}>
                Comprehensive sanitization prevents SQL injection and XSS attacks
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #1e3c72'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔑</span>
                <strong style={{ color: '#1e3c72', fontSize: '1.1rem' }}>
                  Password Protection
                </strong>
              </div>
              <p style={{ color: '#6c757d', margin: 0 }}>
                Advanced hashing and salting ensures your credentials stay secure
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              borderLeft: '4px solid #1e3c72'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚡</span>
                <strong style={{ color: '#1e3c72', fontSize: '1.1rem' }}>
                  Rate Limiting
                </strong>
              </div>
              <p style={{ color: '#6c757d', margin: 0 }}>
                Protection against brute force and DDoS attacks with intelligent throttling
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          marginTop: '4rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '2rem',
            marginBottom: '2rem',
            fontWeight: '700'
          }}>
            Trusted Worldwide
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700' }}>150+</div>
              <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Countries Supported</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700' }}>99.9%</div>
              <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Uptime Guarantee</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700' }}>24/7</div>
              <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Customer Support</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '700' }}>$5B+</div>
              <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Transactions Processed</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!loggedIn && (
          <div style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '3rem 2rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ 
              color: '#1e3c72',
              fontSize: '2rem',
              marginBottom: '1rem',
              fontWeight: '700'
            }}>
              Ready to Get Started?
            </h3>
            <p style={{ 
              fontSize: '1.2rem',
              color: '#6c757d',
              marginBottom: '2rem'
            }}>
              Join thousands of customers who trust our Payments Portal for secure international transactions
            </p>
            <Link 
              to="/register"
              style={{
                backgroundColor: '#1e3c72',
                color: 'white',
                padding: '1rem 3rem',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '1.2rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'inline-block'
              }}
            >
              Open Your Account Today →
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#1e3c72',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        marginTop: '4rem'
      }}>
        <p style={{ margin: '0.5rem 0', opacity: '0.9' }}>
          © 2025 Payments Portal. All rights reserved.
        </p>
        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', opacity: '0.8' }}>
          Secure • Reliable • Global
        </p>
      </div>
    </div>
  );
}

export default HomePage;