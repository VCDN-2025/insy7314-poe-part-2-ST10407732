import React, { useState, useEffect } from "react";
import { getUserPayments } from "../services/api";

function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getUserPayments();
      setPayments(response.data.payments || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'processing':
        return '#3498db';
      case 'failed':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⟳</div>
        <p>Loading your payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '2rem auto'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      {payments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
            No Payments Yet
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            You haven't made any international payments yet.
          </p>
        </div>
      ) : (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#2c3e50', margin: 0 }}>
              Your Payments ({payments.length})
            </h3>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {payments.map((payment) => (
              <div
                key={payment._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px solid #ecf0f1'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h4 style={{
                      color: '#2c3e50',
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.5rem'
                    }}>
                      {payment.currency} {parseFloat(payment.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </h4>
                    <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem' }}>
                      {new Date(payment.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(payment.status) + '20',
                    color: getStatusColor(payment.status),
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'capitalize'
                  }}>
                    {payment.status}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #ecf0f1'
                }}>
                  <div>
                    <p style={{
                      color: '#7f8c8d',
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.85rem'
                    }}>
                      Provider
                    </p>
                    <p style={{
                      color: '#2c3e50',
                      margin: 0,
                      fontWeight: 'bold'
                    }}>
                      {payment.provider}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      color: '#7f8c8d',
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.85rem'
                    }}>
                      Payee Account
                    </p>
                    <p style={{
                      color: '#2c3e50',
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '0.95rem'
                    }}>
                      {payment.payeeAccount}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      color: '#7f8c8d',
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.85rem'
                    }}>
                      SWIFT Code
                    </p>
                    <p style={{
                      color: '#2c3e50',
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '0.95rem'
                    }}>
                      {payment.swiftCode}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      color: '#7f8c8d',
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.85rem'
                    }}>
                      Payment ID
                    </p>
                    <p style={{
                      color: '#2c3e50',
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }}>
                      {payment._id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsList;