import React, { useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { FaUser, FaBell, FaSignOutAlt, FaCog, FaChevronDown, FaBars } from 'react-icons/fa';
import '../../assets/styles/components/Navbar.css';
import AuthService from "../../services/AuthService.js";
import {useAuth} from "../../hooks/useAuth.jsx";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, checkSession } = useAuth();
  const nav = useNavigate();
  
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 현재 경로가 주어진 경로와 일치하는지 확인하는 함수
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const response = await AuthService.logout();
      if (response.data.success) {
        await checkSession();
        nav('/');
      }
    } catch (err) {
      console.error("Logout error:", err);
      await checkSession();
      nav('/');
    }
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
          <Link to="/main" className={`menu-item ${isActive('/main') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/history" className={`menu-item ${isActive('/history') ? 'active' : ''}`}>History</Link>
          <Link to="/new" className={`menu-item ${isActive('/new') ? 'active' : ''}`}>Registration</Link>
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
                <Link to="/profile" className={`dropdown-item ${isActive('/profile') ? 'active' : ''}`}>
                  <FaUser className="dropdown-icon" />
                  <span>Profile</span>
                </Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 