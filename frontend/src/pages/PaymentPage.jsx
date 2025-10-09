import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { createPayment } from "../services/api";

function PaymentPage() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    provider: "SWIFT",
    payeeAccount: "",
    payeeName: "",
    swiftCode: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Currency options (ISO 4217)
  const currencies = ["USD", "EUR", "GBP", "ZAR", "JPY", "CAD", "AUD", "CHF"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Apply input restrictions
    if (name === 'amount') {
      // Allow only numbers and decimal point
      sanitizedValue = value.replace(/[^\d.]/g, '');
      // Prevent multiple decimal points
      const parts = sanitizedValue.split('.');
      if (parts.length > 2) {
        sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      // Limit to 2 decimal places
      if (parts[1] && parts[1].length > 2) {
        sanitizedValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    } else if (name === 'payeeAccount') {
      // Only allow digits, max 20
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 20) return;
    } else if (name === 'swiftCode') {
      // Only allow uppercase letters and numbers, max 11
      sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (sanitizedValue.length > 11) return;
    } else if (name === 'payeeName') {
      // Only allow letters, spaces, and common name characters
      sanitizedValue = value.replace(/[^A-Za-z ,.'-]/g, '');
      if (sanitizedValue.length > 100) return;
    } else if (name === 'currency') {
      sanitizedValue = value.toUpperCase();
    }
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validateForm = () => {
    const { amount, currency, payeeAccount, payeeName, swiftCode } = form;
    
    // Amount validation
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number");
      return false;
    }
    
    if (amountNum > 1000000) {
      setError("Amount exceeds maximum limit of 1,000,000");
      return false;
    }
    
    // Currency validation (3 uppercase letters)
    if (!/^[A-Z]{3}$/.test(currency)) {
      setError("Invalid currency code");
      return false;
    }
    
    // Payee name validation
    if (!payeeName || payeeName.length < 2) {
      setError("Payee name must be at least 2 characters");
      return false;
    }
    
    // Payee account validation (6-20 digits)
    if (!/^\d{6,20}$/.test(payeeAccount)) {
      setError("Payee account must be 6-20 digits");
      return false;
    }
    
    // SWIFT code validation (8-11 characters)
    if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode)) {
      setError("SWIFT code must be 8 or 11 characters (format: AAAABBCCXXX)");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      const paymentData = {
        amount: parseFloat(form.amount),
        currency: form.currency,
        provider: form.provider,
        payeeAccount: form.payeeAccount,
        swiftCode: form.swiftCode
      };
      
      const response = await createPayment(paymentData);
      
      setSuccess("Payment successfully created! Payment ID: " + response.data.paymentId);
      setError("");
      
      // Reset form after successful payment
      setTimeout(() => {
        setForm({
          amount: "",
          currency: "USD",
          provider: "SWIFT",
          payeeAccount: "",
          payeeName: "",
          swiftCode: ""
        });
        setSuccess("");
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      marginTop: '-2rem', 
      marginLeft: '-2rem', 
      marginRight: '-2rem',
      paddingBottom: '4rem'
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '3rem 2rem',
        marginBottom: '3rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            Make International Payment
          </h1>
          
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: '0.95'
          }}>
            Account: <strong>{user?.accountNumber}</strong> | Name: <strong>{user?.fullName}</strong>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Payment Amount: *
            </label>
            <input 
              name="amount" 
              type="text"
              value={form.amount} 
              onChange={handleChange}
              required 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #3498db',
                borderRadius: '4px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              placeholder="0.00"
            />
            <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
              Enter the amount you wish to transfer
            </small>
          </div>

          {/* Currency */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Currency: *
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
            <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
              Select the currency for the transaction
            </small>
          </div>

          {/* Provider */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Payment Provider: *
            </label>
            <select
              name="provider"
              value={form.provider}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="SWIFT">SWIFT</option>
            </select>
            <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
              SWIFT is the primary international payment network
            </small>
          </div>

          <div style={{
            backgroundColor: '#ecf0f1',
            padding: '1.5rem',
            borderRadius: '6px',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ 
              color: '#2c3e50', 
              marginBottom: '1rem',
              fontSize: '1.2rem'
            }}>
              Payee Information
            </h3>

            {/* Payee Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Payee Name: *
              </label>
              <input 
                name="payeeName" 
                type="text"
                value={form.payeeName} 
                onChange={handleChange}
                required 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Recipient's full name"
              />
            </div>

            {/* Payee Account */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Payee Account Number: *
              </label>
              <input 
                name="payeeAccount" 
                type="text"
                value={form.payeeAccount} 
                onChange={handleChange}
                required 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="6-20 digit account number"
                maxLength="20"
              />
            </div>

            {/* SWIFT Code */}
            <div style={{ marginBottom: '0' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                SWIFT Code: *
              </label>
              <input 
                name="swiftCode" 
                type="text"
                value={form.swiftCode} 
                onChange={handleChange}
                required 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  textTransform: 'uppercase'
                }}
                placeholder="8 or 11 character SWIFT code"
                maxLength="11"
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                Format: AAAABBCCXXX (e.g., ABCDZAJJXXX)
              </small>
            </div>
          </div>

          {/* Security Notice */}
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem'
          }}>
            <strong style={{ color: '#856404' }}>🔒 Security Notice:</strong>
            <p style={{ margin: '0.5rem 0 0', color: '#856404', fontSize: '0.9rem' }}>
              All payment information is encrypted and validated. Review details carefully before submitting.
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#95a5a6' : '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? "Processing Payment..." : "Pay Now"}
          </button>

          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#721c24', 
              marginTop: '1.5rem',
              backgroundColor: '#f8d7da',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '2px solid #f5c6cb',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>❌</span>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Error</strong>
                {error}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{ 
              color: '#155724', 
              marginTop: '1.5rem',
              backgroundColor: '#d4edda',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '2px solid #c3e6cb',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>✓</span>
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Success!</strong>
                {success}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Information Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2.5rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        marginTop: '2rem'
      }}>
        <h3 style={{ 
          color: '#1e3c72', 
          marginBottom: '1.5rem',
          fontSize: '1.6rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>ℹ️</span> Payment Information
        </h3>
        
        <div style={{ 
          display: 'grid',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #1e3c72'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🌐</span>
              <strong style={{ color: '#1e3c72' }}>SWIFT Network</strong>
            </div>
            <p style={{ color: '#6c757d', margin: 0, lineHeight: '1.6' }}>
              All international payments are processed via the secure SWIFT network
            </p>
          </div>
          
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #1e3c72'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⏱️</span>
              <strong style={{ color: '#1e3c72' }}>Processing Time</strong>
            </div>
            <p style={{ color: '#6c757d', margin: 0, lineHeight: '1.6' }}>
              Transactions typically complete within 1-3 business days
            </p>
          </div>
          
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #1e3c72'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔒</span>
              <strong style={{ color: '#1e3c72' }}>Secure & Encrypted</strong>
            </div>
            <p style={{ color: '#6c757d', margin: 0, lineHeight: '1.6' }}>
              All data protected by SSL/TLS encryption and validated with RegEx patterns
            </p>
          </div>
          
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            borderLeft: '4px solid #1e3c72'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📧</span>
              <strong style={{ color: '#1e3c72' }}>Confirmation</strong>
            </div>
            <p style={{ color: '#6c757d', margin: 0, lineHeight: '1.6' }}>
              Payment confirmation will be sent to your registered email address
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default PaymentPage;