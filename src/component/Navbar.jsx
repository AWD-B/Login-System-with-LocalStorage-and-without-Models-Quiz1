import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="app-navbar">
      <div className="nav-inner">
        <div className="brand">
          Pupp's 🐾 
        </div>

        <nav className="nav-links" aria-label="Primary">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/Login">Login</Link></li>
            <li><Link to="/Signup">Register</Link></li>
            <li><Link to="/Dashing">Dashboard</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;