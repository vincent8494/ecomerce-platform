import React from 'react';
import { Link } from 'react-router-dom';

const Quicklinks: React.FC = () => {
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1e293b', // slate-800
    borderRadius: '0.5rem',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    color: '#e2e8f0', // slate-200
    textDecoration: 'none',
    display: 'block',
  };

  const cardHoverStyle: React.CSSProperties = {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#ffffff',
  };

  const cardTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: '#cbd5e1', // slate-300
  };

  // Quick links data
  const quickLinks = [
    {
      title: 'Shop All Products',
      description: 'Browse our complete collection of products',
      link: '/products',
    },
    {
      title: 'New Arrivals',
      description: 'Discover our latest products',
      link: '/new-arrivals',
    },
    {
      title: 'Sale Items',
      description: 'Special offers and discounted products',
      link: '/sale',
    },
    {
      title: 'Customer Support',
      description: 'Get help with your orders and account',
      link: '/contact',
    },
    {
      title: 'Track Order',
      description: 'Check the status of your order',
      link: '/profile/orders',
    },
    {
      title: 'FAQs',
      description: 'Find answers to common questions',
      link: '/faq',
    },
  ];

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Quick Links</h1>
        <div style={gridStyle}>
          {quickLinks.map((item, index) => (
            <Link 
              key={index} 
              to={item.link}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = cardHoverStyle.transform;
                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow as string;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h2 style={cardTitleStyle}>{item.title}</h2>
              <p style={cardTextStyle}>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quicklinks;
