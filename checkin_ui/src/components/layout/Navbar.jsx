import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBell, FaSignOutAlt, FaCog, FaChevronDown, FaBars } from 'react-icons/fa';
import '../../assets/styles/components/Navbar.css';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/main">
            <span className="logo-text">CheckIn</span>
          </Link>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          <FaBars />
        </div>

        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/main" className="menu-item active">Dashboard</Link>
          <Link to="/events" className="menu-item">History</Link>
          <Link to="/teams" className="menu-item">My child</Link>
        </div>

        <div className="navbar-right">

          <div className="profile-dropdown">
            <div className="profile-toggle" onClick={toggleProfile}>
              <div className="avatar">
                <FaUser />
              </div>
              <span className="user-name">User</span>
              <FaChevronDown className={`dropdown-icon ${profileOpen ? 'open' : ''}`} />
            </div>

            {profileOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <FaUser className="dropdown-icon" />
                  <span>Profile</span>
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/" className="dropdown-item">
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Logout</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 