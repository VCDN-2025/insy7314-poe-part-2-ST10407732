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
    } else if (name === 'currency') {
      sanitizedValue = value.toUpperCase();
    }
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validateForm = () => {
    const { amount, currency, payeeAccount, swiftCode } = form;
    
    // Amount validation
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number");
      return false;
    }
    
    if (amountNum > 1000000000) {
      setError("Amount exceeds maximum limit of 1,000,000,000");
      return false;
    }
    
    // Currency validation (3 uppercase letters)
    if (!/^[A-Z]{3}$/.test(currency)) {
      setError("Invalid currency code");
      return false;
    }
    
    // Payee account validation (6-20 digits)
    if (!/^\d{6,20}$/.test(payeeAccount)) {
      setError("Payee account must be 6-20 digits");
      return false;
    }
    
    // SWIFT code validation (8-11 characters)
    const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!swiftPattern.test(swiftCode)) {
      setError("SWIFT code must be 8 or 11 characters (e.g., ABCDZAJJ)");
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
      
      console.log("Submitting payment:", paymentData);
      
      const response = await createPayment(paymentData);
      
      setSuccess("Payment successfully created! Payment ID: " + response.data.paymentId);
      setError("");
      
      // Redirect to payments page after 2 seconds
      setTimeout(() => {
        navigate("/payments");
      }, 2000);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.error || "Payment failed. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          marginBottom: '0.5rem',
          fontSize: '2rem'
        }}>
          International Payment Portal
        </h1>
        
        <p style={{ 
          color: '#7f8c8d',
          marginBottom: '2rem',
          fontSize: '0.95rem'
        }}>
          Account: <strong>{user?.accountNumber}</strong> | 
          Name: <strong>{user?.fullName}</strong>
        </p>

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
                fontWeight: 'bold',
                boxSizing: 'border-box'
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
                cursor: 'pointer',
                boxSizing: 'border-box',
                backgroundColor: 'white'
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
                cursor: 'pointer',
                boxSizing: 'border-box',
                backgroundColor: 'white'
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
              Account Information
            </h3>

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
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="6-20 digit account number"
                maxLength="20"
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                Must be 6-20 digits only
              </small>
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
                  textTransform: 'uppercase',
                  boxSizing: 'border-box'
                }}
                placeholder="8-11 character SWIFT code"
                maxLength="11"
              />
              <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                Example: ABCDZAJJ or ABCDZAJJXXX
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
              backgroundColor: loading ? '#95a5a6' : '#27ae60',
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
              color: '#e74c3c', 
              marginTop: '1rem',
              backgroundColor: '#fadbd8',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e74c3c'
            }}>
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{ 
              color: '#27ae60', 
              marginTop: '1rem',
              backgroundColor: '#d5f4e6',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #27ae60'
            }}>
              <strong>✓ Success:</strong> {success}
            </div>
          )}
        </form>
      </div>

      {/* Additional Information */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          Payment Information
        </h3>
        <ul style={{ color: '#7f8c8d', lineHeight: '1.8' }}>
          <li>All international payments are processed via SWIFT network</li>
          <li>Transaction processing time: 1-3 business days</li>
          <li>All inputs are validated and sanitized for security</li>
          <li>SSL encryption protects all data transmission</li>
          <li>Payment confirmation will be sent to your registered email</li>
        </ul>
      </div>
    </div>
  );
}

export default PaymentPage;