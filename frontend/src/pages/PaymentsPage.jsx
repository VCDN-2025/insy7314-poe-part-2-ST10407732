import React from "react";
import PaymentsList from "../components/PaymentsList";
import { Link } from "react-router-dom";

function PaymentsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            color: '#2c3e50', 
            marginBottom: '0.5rem',
            fontSize: '2rem'
          }}>
            Payment History
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '1rem', margin: 0 }}>
            View and track all your international payments
          </p>
        </div>

        <Link
          to="/make-payment"
          style={{
            backgroundColor: '#27ae60',
            color: 'white',
            padding: '0.75rem 1.5rem',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          + New Payment
        </Link>
      </div>

      <PaymentsList />
    </div>
  );
}

export default PaymentsPage;