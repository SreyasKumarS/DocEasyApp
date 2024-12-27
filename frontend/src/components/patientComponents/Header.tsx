import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../../slices/patientSlice/patientAuthSlice'; 
import { useNavigate,Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { RootState } from '../../../store'; 
import axios from 'axios';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const isAuthenticated = useSelector((state: RootState) => state.PatientAuth.isAuthenticated);
  const user = useSelector((state: RootState) => state.PatientAuth.user);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/patients/logout', {}, {
        withCredentials: true, 
      });
      dispatch(clearCredentials());
      navigate('/patient/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: '#007bff',
        padding: '10px 50px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container-fluid">
      <Link
        className="navbar-brand text-white"
        to="/patient/HomeScreen" 
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
        }}
      >
       DocEasy
      </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {!isAuthenticated ? (
              <>
                {/* Show Login and Signup options when not authenticated */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="loginDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '30px' }}
                  >
                    Login
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                    <li><a className="dropdown-item" href="/doctor/login">As Doctor</a></li>
                    <li><a className="dropdown-item" href="/patient/login">As Patient</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="signupDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '30px' }}
                  >
                    Signup
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="register">
                    <li><a className="dropdown-item" href="/doctor/register">As Doctor</a></li>
                    <li><a className="dropdown-item" href="/patient/register">As Patient</a></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                {/* Show Patient's Name when authenticated */}
                <li className="nav-item">
                  <span className="nav-link text-white" style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '30px' }}>
                    Hello, {user?.name || 'Patient'}
                  </span>
                </li>
                {/* Show Logout option when authenticated */}
                <li className="nav-item">
                  <a
                    className="nav-link text-white"
                    href="#"
                    onClick={handleLogout}
                    style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '30px' }}
                  >
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
