// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/protected', {
      headers: {
        Authorization: 'Bearer testtoken' // dummy token
      },
      withCredentials: true // required for cookies if used
    })
    .then(res => setMessage(res.data.message))
    .catch(err => setMessage('❌ Error: ' + err.message));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>Payments Portal</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}

export default App;
