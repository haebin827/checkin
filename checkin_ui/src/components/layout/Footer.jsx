import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import '../../assets/styles/components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>© {currentYear} CheckIn. 모든 권리 보유.</p>
      </div>
    </footer>
  );
};

export default Footer; 