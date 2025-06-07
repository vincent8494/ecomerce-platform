import React from 'react';
import { Link } from 'react-router-dom';

const CustomerService: React.FC = () => {
  const pageStyle: React.CSSProperties = {
    backgroundColor: '#0f172a', // slate-900
    color: '#f8fafc', // slate-50
    minHeight: '100vh',
    padding: '2rem 0',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#ffffff',
    textAlign: 'center',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '3rem',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '1.5rem 0 1rem',
    color: '#ffffff',
    borderBottom: '1px solid #334155', // slate-700
    paddingBottom: '0.5rem',
  };

  const textStyle: React.CSSProperties = {
    lineHeight: '1.6',
    marginBottom: '1rem',
    color: '#e2e8f0', // slate-200
  };

  const linkStyle: React.CSSProperties = {
    color: '#60a5fa', // blue-400
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const listStyle: React.CSSProperties = {
    listStyleType: 'disc',
    paddingLeft: '1.5rem',
    marginBottom: '1.5rem',
  };

  const listItemStyle: React.CSSProperties = {
    marginBottom: '0.5rem',
    color: '#e2e8f0', // slate-200
  };

  const contactCardStyle: React.CSSProperties = {
    backgroundColor: '#1e293b', // slate-800
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginTop: '1rem',
  };

  const contactItemStyle: React.CSSProperties = {
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Customer Service</h1>
        
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>How Can We Help You?</h2>
          <p style={textStyle}>
            We're here to help with any questions or concerns you may have. 
            Browse our help topics below or contact our customer service team directly.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Frequently Asked Questions</h2>
          <ul style={listStyle}>
            <li style={listItemStyle}>
              <Link to="/shipping-policy" style={linkStyle}>What are your shipping options?</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/returns" style={linkStyle}>How do I return an item?</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/track-order" style={linkStyle}>How can I track my order?</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/payment-options" style={linkStyle}>What payment methods do you accept?</Link>
            </li>
          </ul>
          <p style={textStyle}>
            <Link to="/faq" style={linkStyle}>View all FAQs →</Link>
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Contact Us</h2>
          <div style={contactCardStyle}>
            <div style={contactItemStyle}>
              <span>📧</span>
              <span>Email: <a href="mailto:support@example.com" style={linkStyle}>support@example.com</a></span>
            </div>
            <div style={contactItemStyle}>
              <span>📞</span>
              <span>Phone: <a href="tel:+1234567890" style={linkStyle}>(123) 456-7890</a></span>
            </div>
            <div style={contactItemStyle}>
              <span>🕒</span>
              <span>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</span>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Quick Links</h2>
          <ul style={listStyle}>
            <li style={listItemStyle}>
              <Link to="/orders" style={linkStyle}>Order Status</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/shipping-policy" style={linkStyle}>Shipping Policy</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/returns" style={linkStyle}>Returns & Exchanges</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link>
            </li>
            <li style={listItemStyle}>
              <Link to="/terms" style={linkStyle}>Terms of Service</Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CustomerService;
