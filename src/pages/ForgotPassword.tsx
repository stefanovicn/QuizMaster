import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import '../css/Auth.css';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('code');
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 4) return;
    console.log('Code submitted:', fullCode);
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    setCode(['', '', '', '']);
    inputs.current[0]?.focus();
    console.log('Resend code to:', email);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">

        {step === 'email' ? (
          <>
            <div className="auth-header">
              <div className="auth-logo">
                <img src="/src/assets/logo.png" alt="QuizMaster logo" className="logo-img" />
              </div>
              <h1 className="auth-title">Forgot password</h1>
            </div>

            <div className="auth-form">
              <p className="auth-subtitle">Enter your email and we'll send you a reset code.</p>
              <br></br>
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              
              <Button fullWidth onClick={handleEmailSubmit}>Send code</Button>
            </div>

            <div className="auth-footer">
              <p>Remembered it? <Link to="/login" className="auth-link">Login here</Link></p>
            </div>
          </>
        ) : (
          <>
            <div className="auth-header" style={{ justifyContent: 'flex-start', gap: '14px' }}>
              <div className="auth-logo">
                <img src="/src/assets/logo.png" alt="QuizMaster logo" className="logo-img" />
              </div>
              <h1 className="auth-title">Password reset form</h1>
            </div>

            <div className="auth-form">
              <p className="auth-subtitle" style={{ textAlign: 'center' }}>
                An authentication code has been sent to your email
              </p>
              <p className="auth-email-display">{email}</p>

              <div className="auth-code-row">
                {code.map((digit, i) => (
                  <input placeholder="-"
                    key={i}
                    ref={el => { inputs.current[i] = el; }}
                    className="auth-code-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                  />
                ))}
              </div>

              <Button variant="ghost" fullWidth onClick={handleConfirm}>Confirm</Button>
              <Button fullWidth onClick={handleResend}>Re-send code</Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}