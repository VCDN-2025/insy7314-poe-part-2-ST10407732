import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Apply input restrictions based on field
    let sanitizedValue = value;
    
    if (name === 'fullName') {
      // Only allow letters, spaces, and common name characters
      sanitizedValue = value.replace(/[^A-Za-z ,.'-]/g, '');
      if (sanitizedValue.length > 100) return;
    } else if (name === 'idNumber') {
      // Only allow digits, max 13
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 13) return;
    } else if (name === 'accountNumber') {
      // Only allow digits, max 20
      sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 20) return;
    } else if (name === 'password' || name === 'confirmPassword') {
      // Limit password length
      if (value.length > 128) return;
    }
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validateForm = () => {
    const { fullName, idNumber, accountNumber, password, confirmPassword } = form;
    
    if (!fullName || fullName.length < 2) {
      setError("Full name must be at least 2 characters");
      return false;
    }
    
    if (!idNumber || idNumber.length !== 13) {
      setError("ID number must be exactly 13 digits");
      return false;
    }
    
    if (!accountNumber || accountNumber.length < 6) {
      setError("Account number must be at least 6 digits");
      return false;
    }
    
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setError("Password must contain: uppercase, lowercase, number, special character (@$!%*?&), min 8 chars");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
      const { confirmPassword, ...submitData } = form;
      await registerUser(submitData);
      setSuccess("Registration successful! You can now login.");
      setError("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Full Name: *
          </label>
          <input 
            name="fullName" 
            value={form.fullName} 
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
            placeholder="Enter your full name"
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Email: (Optional)
          </label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            placeholder="Enter your email"
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            ID Number: *
          </label>
          <input 
            name="idNumber" 
            value={form.idNumber} 
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
            placeholder="13-digit ID number"
            maxLength="13"
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Account Number: *
          </label>
          <input 
            name="accountNumber" 
            value={form.accountNumber} 
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
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Password: *
          </label>
          <input 
            name="password" 
            type="password" 
            value={form.password} 
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
            placeholder="Strong password required"
            maxLength="128"
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            Must contain: uppercase, lowercase, number, special character (@$!%*?&)
          </small>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Confirm Password: *
          </label>
          <input 
            name="confirmPassword" 
            type="password" 
            value={form.confirmPassword} 
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
            placeholder="Confirm your password"
            maxLength="128"
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#95a5a6' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        
        {error && (
          <p style={{ 
            color: '#e74c3c', 
            marginTop: '1rem', 
            textAlign: 'center',
            backgroundColor: '#fadbd8',
            padding: '0.75rem',
            borderRadius: '4px'
          }}>
            {error}
          </p>
        )}
        
        {success && (
          <p style={{ 
            color: '#27ae60', 
            marginTop: '1rem', 
            textAlign: 'center',
            backgroundColor: '#d5f4e6',
            padding: '0.75rem',
            borderRadius: '4px'
          }}>
            {success}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;