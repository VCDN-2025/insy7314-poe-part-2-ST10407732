import React, { useEffect, useState } from "react";
import PaymentsList from "../components/PaymentsList";
import { Link } from "react-router-dom";
import { getUserPayments } from "../services/api";

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getUserPayments();
        console.log("PaymentsPage API Response:", res.data);
        
        // Handle different response structures
        const paymentsData = res.data?.payments || res.data || [];
        console.log("PaymentsPage Payments array:", paymentsData);
        
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error("PaymentsPage Error fetching payments:", err.response?.data || err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate stats - handle different status formats (same logic as DashboardPage)
  const totalPayments = payments.length;
  
  // Check for both lowercase and capitalized status
  const completedPayments = payments.filter(p => 
    p.status?.toLowerCase() === 'completed' || 
    p.status?.toLowerCase() === 'approved'
  ).length;
  
  const pendingPayments = payments.filter(p => 
    p.status?.toLowerCase() === 'pending'
  ).length;

  console.log("PaymentsPage Stats:", { totalPayments, completedPayments, pendingPayments, paymentsData: payments });

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      marginTop: '-2rem', 
      marginLeft: '-2rem', 
      marginRight: '-2rem',
      paddingBottom: '3rem'
    }}>
      {/* Hero Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '3rem 2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          opacity: '0.5'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          opacity: '0.5'
        }}></div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px'
              }}>
                <span style={{ fontSize: '2rem' }}>📊</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>
                  TRANSACTION HISTORY
                </span>
              </div>
              
              <h1 style={{ 
                fontSize: '2.8rem', 
                marginBottom: '1rem',
                fontWeight: '700',
                letterSpacing: '-1px',
                lineHeight: '1.2'
              }}>
                Payment History
              </h1>
              
              <p style={{ 
                fontSize: '1.2rem', 
                opacity: '0.95',
                margin: 0,
                maxWidth: '500px'
              }}>
                Track and manage all your international payments in one secure location
              </p>
            </div>

            <Link
              to="/make-payment"
              style={{
                backgroundColor: 'white',
                color: '#1e3c72',
                padding: '1.2rem 2.5rem',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                border: '3px solid white'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>💳</span>
              <span>New Payment</span>
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '-3rem auto 2rem',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Total Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '5px solid #27ae60',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#7f8c8d', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Total Payments
                </p>
                <h3 style={{ 
                  color: '#2c3e50', 
                  fontSize: '2.2rem', 
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {loading ? '...' : totalPayments}
                </h3>
                <p style={{ 
                  color: '#27ae60', 
                  fontSize: '0.85rem',
                  margin: '0.5rem 0 0',
                  fontWeight: '600'
                }}>
                  All transactions
                </p>
              </div>
              <div style={{
                backgroundColor: '#d5f4e6',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '1.8rem'
              }}>
                💰
              </div>
            </div>
          </div>

          {/* Successful Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '5px solid #3498db'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#7f8c8d', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Successful
                </p>
                <h3 style={{ 
                  color: '#2c3e50', 
                  fontSize: '2.2rem', 
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {loading ? '...' : completedPayments}
                </h3>
                <p style={{ 
                  color: '#3498db', 
                  fontSize: '0.85rem',
                  margin: '0.5rem 0 0',
                  fontWeight: '600'
                }}>
                  Completed
                </p>
              </div>
              <div style={{
                backgroundColor: '#d6eaf8',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '1.8rem'
              }}>
                ✓
              </div>
            </div>
          </div>

          {/* Pending Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderLeft: '5px solid #f39c12'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#7f8c8d', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pending
                </p>
                <h3 style={{ 
                  color: '#2c3e50', 
                  fontSize: '2.2rem', 
                  margin: 0,
                  fontWeight: '700'
                }}>
                  {loading ? '...' : pendingPayments}
                </h3>
                <p style={{ 
                  color: '#f39c12', 
                  fontSize: '0.85rem',
                  margin: '0.5rem 0 0',
                  fontWeight: '600'
                }}>
                  Awaiting review
                </p>
              </div>
              <div style={{
                backgroundColor: '#fef5e7',
                borderRadius: '12px',
                padding: '0.75rem',
                fontSize: '1.8rem'
              }}>
                ⏳
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        padding: '0 2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#7f8c8d',
              fontSize: '0.95rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <span>Filter by status:</span>
            </div>
            <button style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              border: '2px solid #3498db',
              backgroundColor: '#3498db',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              All
            </button>
            <button style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              border: '2px solid #ddd',
              backgroundColor: 'white',
              color: '#7f8c8d',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Completed
            </button>
            <button style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              border: '2px solid #ddd',
              backgroundColor: 'white',
              color: '#7f8c8d',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Pending
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <button style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              color: '#7f8c8d',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📥</span>
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Payments List */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          minHeight: '400px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.5rem',
              margin: 0,
              fontWeight: '700'
            }}>
              All Transactions
            </h2>
            <div style={{
              color: '#7f8c8d',
              fontSize: '0.9rem',
              backgroundColor: '#f8f9fa',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontWeight: '600'
            }}>
              {loading ? 'Loading...' : `${totalPayments} transactions`}
            </div>
          </div>

          <PaymentsList />
        </div>
      </div>

      {/* Help Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '3rem auto 0',
        padding: '0 2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '2.5rem',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
          <h3 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            Need Help with a Payment?
          </h3>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: '0.95',
            marginBottom: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem'
          }}>
            Our support team is available 24/7 to assist you with any payment inquiries or issues
          </p>
          <button style={{
            backgroundColor: 'white',
            color: '#667eea',
            padding: '1rem 2.5rem',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentsPage;