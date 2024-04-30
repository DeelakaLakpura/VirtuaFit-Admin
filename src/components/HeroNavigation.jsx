import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faEye, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import './style.css'; // Custom CSS for additional styling

const LeftNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="toggle-button" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <nav className={`left-navigation ${isOpen ? 'open' : 'closed'}`}>
        <ul className="nav">
        <li>
            <div className={`logo ${isOpen ? 'visible' : 'hidden'}`}>
              <span className="logo-text">Virtuafit</span>
            </div>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              {isOpen && <span className="nav-text">Home</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add-product" className="nav-link">
              <FontAwesomeIcon icon={faPlus} className="nav-icon" />
              {isOpen && <span className="nav-text">Add Product</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/view-product" className="nav-link">
              <FontAwesomeIcon icon={faEye} className="nav-icon" />
              {isOpen && <span className="nav-text">View Product</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user-profile" className="nav-link">
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              {isOpen && <span className="nav-text">User Profile</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LeftNavigation;
