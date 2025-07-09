import React from 'react';
import '../../assets/styles/components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>© {currentYear} CheckIn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
