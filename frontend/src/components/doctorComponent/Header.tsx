import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../../slices/doctorSlice/doctorAuthSlice'; 
import { useNavigate, Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { RootState } from '../../../store';
import { FaComments } from 'react-icons/fa'; 
import api from '../../axios';
import { toast } from 'react-toastify';

const DoctorHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => state.DoctorAuth.isAuthenticated);
  const user = useSelector((state: RootState) => state.DoctorAuth.user);


  const handleLogout = async () => {
    try {
      await api.post('/doctor/logout'); 
      dispatch(clearCredentials());
      navigate('/doctor/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: '#3A9F98', 
        padding: '10px 50px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container-fluid">
      <Link
        className="navbar-brand text-white"
        to="/doctor/DoctorHomeScreen" 
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
        }}
      >
       DocEasy-Doctor Panel
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
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/doctor/ChatListandRequests"
                  style={{ fontSize: '1.2rem', fontWeight: '500', marginLeft: '30px' }}
                >
                  <FaComments /> Chat
                </Link>
              </li>
            )}
            {!isAuthenticated ? (
              <>
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
                    <li><a className="dropdown-item" href="/doctor/login">Doctor </a></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white" style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '30px' }}>
                    Hello, Dr. {user?.name || 'Doctor'}
                  </span>
                </li>
                
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

export default DoctorHeader;
