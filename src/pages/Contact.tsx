import { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import '../css/Contact.css';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Layout>
      <section className='contact-card'>
        <div>
          <h1 className="contact-title">Contact us</h1>
          <p className="contact-subtitle">Feel free to send us a message</p>
        </div>
        

        <textarea
          className="contact-textarea"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="contact"
        />

        {sent && (
          <div className="contact-success">
            ✓ Message sent! We'll get back to you soon.
          </div>
        )}

        <Button onClick={handleSend}>Send</Button>
      </section>
        
    </Layout>
  );
}