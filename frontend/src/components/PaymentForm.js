import React, { useState } from "react";
import { createPayment } from "../services/api";
import { useNavigate } from "react-router-dom";

function PaymentForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Multi-step form
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

  // Common currencies
  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "ZAR", name: "South African Rand" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
  ];

  const providers = ["SWIFT", "SEPA", "WIRE", "ACH"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const validateStep1 = () => {
    const amount = parseFloat(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }
    if (amount > 1000000000) {
      setError("Amount cannot exceed 1,000,000,000");
      return false;
    }
    if (!form.currency) {
      setError("Please select a currency");
      return false;
    }
    if (!form.provider) {
      setError("Please select a payment provider");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Validate payee account (6-20 digits)
    const accountPattern = /^\d{6,20}$/;
    if (!accountPattern.test(form.payeeAccount)) {
      setError("Payee account must be 6-20 digits only");
      return false;
    }

    // Validate SWIFT code (8 or 11 characters, format: AAAABBCCXXX)
    const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!swiftPattern.test(form.swiftCode.toUpperCase())) {
      setError("Invalid SWIFT code format (e.g., AAAABBCCXXX)");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError("");
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError("");

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
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        padding: '0 1rem'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: step >= 1 ? '#3498db' : '#bdc3c7',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontWeight: 'bold'
          }}>1</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
            Payment Details
          </div>
        </div>
        
        <div style={{ flex: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            height: '2px',
            flex: 1,
            backgroundColor: step >= 2 ? '#3498db' : '#bdc3c7'
          }}></div>
        </div>
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: step >= 2 ? '#3498db' : '#bdc3c7',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontWeight: 'bold'
          }}>2</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
            Account Info
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>
              Step 1: Payment Details
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#2c3e50',
                fontWeight: 'bold'
              }}>
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
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
            </div>

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
                {providers.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Next: Account Information →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>
              Step 2: Account Information
            </h3>

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
                onChange={handleChange}
                placeholder="Enter payee account (6-20 digits)"
                pattern="\d{6,20}"
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
                Must be 6-20 digits
              </small>
            </div>

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
                placeholder="Enter SWIFT code (e.g., AAAABBCCXXX)"
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

            {/* Payment Summary */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#ecf0f1',
              borderRadius: '4px',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ color: '#2c3e50', marginBottom: '0.75rem' }}>
                Payment Summary
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#7f8c8d' }}>Amount:</span>
                <strong style={{ color: '#2c3e50' }}>
                  {form.currency} {parseFloat(form.amount || 0).toLocaleString()}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#7f8c8d' }}>Provider:</span>
                <strong style={{ color: '#2c3e50' }}>{form.provider}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2,
                  padding: '1rem',
                  backgroundColor: loading ? '#95a5a6' : '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default PaymentForm;