import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '../../slices/adminSlice/adminAuthSlice'; 
import { useNavigate,Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { RootState } from '../../../store';
import api from '../../axios';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => state.AdminAuth.isAuthenticated);
  const user = useSelector((state: RootState) => state.AdminAuth.user);


  const handleLogout = async () => {
    try {
      await api.post('/admin/logout'); 
      dispatch(clearCredentials());
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  return (
    <nav
    className="navbar navbar-expand-lg"
    style={{
      backgroundColor: '#ffc107', 
      padding: '10px 50px',
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    <div className="container-fluid">
      <Link
        className="navbar-brand text-white"
        to="/admin/adminHomeScreen" 
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
        }}
      >
       Admin Panel
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
                    <li><a className="dropdown-item" href="/admin/login">Admin</a></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white" style={{ fontSize: '1rem', fontWeight: '500', marginLeft: '30px' }}>
                    Hello, {user?.name || 'Admin'}
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

export default AdminHeader;
