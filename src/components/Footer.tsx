import '../css/Footer.css';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <img src={logo} alt="Logo sajta" className="logo-img"/>
        <span className="footer-copy">QuizMaster – Copyright © QuizMaster Inc. 2026</span>
      </div>
    </footer>
  );
}
