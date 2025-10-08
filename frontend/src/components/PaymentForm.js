import React, { useState } from "react";
import { createPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function PaymentForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    provider: "SWIFT",
    payeeAccount: "",
    swiftCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "ZAR", name: "South African Rand" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleAccountChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 20) {
      setForm({ ...form, payeeAccount: value });
      setError("");
    }
  };

  const validateForm = () => {
    // Amount validation
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }
    if (amount > 1000000000) {
      setError("Amount cannot exceed 1,000,000,000");
      return false;
    }

    // Currency validation
    if (!form.currency) {
      setError("Please select a currency");
      return false;
    }

    // Provider validation
    if (!form.provider) {
      setError("Please select a payment provider");
      return false;
    }

    // Payee account validation (6-20 digits)
    const accountPattern = /^\d{6,20}$/;
    if (!accountPattern.test(form.payeeAccount)) {
      setError("Payee account must be 6-20 digits only");
      return false;
    }

    // SWIFT code validation (8 or 11 characters)
    const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!swiftPattern.test(form.swiftCode.toUpperCase())) {
      setError("Invalid SWIFT code format (e.g., ABCDZAJJ or ABCDZAJJXXX)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    console.log("Submitting payment data:", form);

    try {
      const response = await createPayment(form);
      console.log("Payment created:", response.data);
      setSuccess(true);
      
      // Redirect to payments page after 2 seconds
      setTimeout(() => {
        navigate("/payments");
      }, 2000);
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.error || "Failed to process payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#155724', marginBottom: '1rem' }}>
          ✓ Payment Submitted Successfully!
        </h2>
        <p style={{ color: '#155724', fontSize: '1.1rem' }}>
          Your payment of {form.currency} {parseFloat(form.amount).toLocaleString()} has been submitted.
        </p>
        <p style={{ color: '#155724', marginTop: '1rem' }}>
          Redirecting to payments page...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', textAlign: 'center' }}>
        International Payment Form
      </h2>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Payment Amount */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            Payment Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter the amount you wish to transfer"
            step="0.01"
            min="0.01"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Currency */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            Currency *
          </label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>
          <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
            Select the currency for the transaction
          </small>
        </div>

        {/* Payment Provider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            Payment Provider *
          </label>
          <select
            name="provider"
            value={form.provider}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
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

        <h3 style={{ color: '#2c3e50', marginTop: '2rem', marginBottom: '1rem', borderTop: '2px solid #ecf0f1', paddingTop: '1rem' }}>
          Account Information
        </h3>

        {/* Payee Account Number */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            Payee Account Number *
          </label>
          <input
            type="text"
            name="payeeAccount"
            value={form.payeeAccount}
            onChange={handleAccountChange}
            placeholder="Enter payee account (6-20 digits)"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
            Must be 6-20 digits only
          </small>
        </div>

        {/* SWIFT Code */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 'bold'
          }}>
            SWIFT Code *
          </label>
          <input
            type="text"
            name="swiftCode"
            value={form.swiftCode}
            onChange={handleChange}
            placeholder="Example: ABCDZAJJ or ABCDZAJJXXX"
            maxLength="11"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #dfe6e9',
              borderRadius: '4px',
              boxSizing: 'border-box',
              textTransform: 'uppercase'
            }}
          />
          <small style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
            Format: 6 letters (bank code) + 2 letters/digits (country) + 3 optional characters
          </small>
        </div>

        {/* Security Notice */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ color: '#856404' }}>🔒 Security Notice:</strong>
          <p style={{ color: '#856404', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
            All payment information is encrypted and validated. Review details carefully before submitting.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: loading ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;