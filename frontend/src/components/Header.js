import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <h1>🚀 Fullstack CI/CD Boilerplate</h1>
      <nav className="nav">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          Home
        </Link>
        <Link 
          to="/users" 
          className={location.pathname === '/users' ? 'active' : ''}
        >
          Users
        </Link>
      </nav>
    </header>
  );
};

export default Header;
