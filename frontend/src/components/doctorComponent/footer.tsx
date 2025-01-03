import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#3a9f98', // Dark Greenish-Blue Color
        color: '#ffffff',
        fontFamily: "'Poppins', sans-serif",
        padding: '40px 0',
      }}
    >
      <div className="container">
        <div className="row text-center text-md-start align-items-center">
          {/* Logo and Slogan */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h3 style={{ fontWeight: '700', fontSize: '1.8rem', marginBottom: '15px' }}>DoctorCare</h3>
            <p style={{ fontSize: '1rem', fontWeight: '500', lineHeight: '1.8' }}>
              Your health is our priority. Providing expert medical care with compassion and professionalism.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '1.2rem' }}>Quick Links</h5>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '1rem',
                lineHeight: '2',
              }}
            >
              <li>
                <a href="/about" className="text-white text-decoration-none">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white text-decoration-none">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white text-decoration-none">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '1.2rem' }}>Contact Us</h5>
            <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
              <strong>Phone:</strong> <a href="tel:9999888777" className="text-white text-decoration-none">9999888777</a> <br />
              <strong>Email:</strong> <a href="mailto:doctorcare@gmail.com" className="text-white text-decoration-none">doctorcare@gmail.com</a>
            </p>
            <div>
              <h6 style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '10px' }}>Follow Us</h6>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white me-3 fs-5">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white me-3 fs-5">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white me-3 fs-5">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white fs-5">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        <hr
          style={{
            borderColor: '#ffffff',
            margin: '20px 0',
          }}
        />

        {/* Footer Bottom */}
        <div className="text-center" style={{ fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} <strong>DoctorCare</strong>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
