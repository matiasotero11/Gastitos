import { useState } from 'react';

export default function Login({ onLogin }) {
  const [pin, setPin] = useState('');
  const CORRECT_PIN = '4752';

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      onLogin();
    } else {
      alert('PIN incorrecto');
      setPin('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
  <img src="https://i.imgur.com/GrlWFaq.png" alt="Gastitos Logo" style={{width: '100%', height: '100%'}} />
</div>
        <h1>GASTITOS</h1>
        <p className="subtitle">v1.0</p>

        <div className="pin-input">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`pin-digit ${pin.length > i ? 'filled' : ''}`}>
              {pin.length > i ? '●' : ''}
            </div>
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} className="key-btn" onClick={() => handleNumberClick(String(num))}>
              {num}
            </button>
          ))}
          <button className="key-btn" onClick={() => handleNumberClick('0')}>
            0
          </button>
          <button className="key-btn delete-btn" onClick={handleDelete}>
            ⌫
          </button>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          ACCEDER
        </button>
      </div>
    </div>
  );
}
