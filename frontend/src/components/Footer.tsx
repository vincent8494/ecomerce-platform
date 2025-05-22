import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay } from 'react-icons/fa';
import { SiAmericanexpress } from 'react-icons/si';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Types
interface NavigationItem {
  label: string;
  path: string;
}

interface FooterSectionProps {
  $delay?: string;
}

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const FooterContainer = styled.footer`
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 3rem 0 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
`;

const FooterSection = styled.div<FooterSectionProps>`
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${props => props.$delay || '0.1s'};
  transform: translateY(20px);
  transition: transform 0.3s ease, opacity 0.3s ease;

  h3 {
    color: #fff;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, #3498db, #9b59b6);
      border-radius: 2px;
    }
  }

  p {
    color: #bdc3c7;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled.a`
  color: #ecf0f1;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  &:hover {
    background: #3498db;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 0.8rem;
`;

const FooterLink = styled.a`
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: inline-block;
  position: relative;
  padding-left: 0;

  &::before {
    content: '→';
    position: absolute;
    left: -20px;
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
    color: #3498db;
  }

  &:hover {
    color: #fff;
    padding-left: 20px;

    &::before {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  position: relative;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  border-radius: 6px;
  color: #fff;
  font-size: 0.95rem;
  width: 100%;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FooterBottom = styled(motion.div)`
  margin-top: 3rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  color: #bdc3c7;
  background-color: rgba(0, 0, 0, 0.1);
`;

const PaymentMethods = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #bdc3c7;
`;

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const quickLinks: NavigationItem[] = [
    { label: 'All Products', path: '/products' },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Sale Items', path: '/sale' },
    { label: 'Blog', path: '/blog' },
    { label: 'About Us', path: '/about' }
  ];

  const customerServiceLinks: NavigationItem[] = [
    { label: 'Contact Us', path: '/contact' },
    { label: 'Shipping Policy', path: '/shipping' },
    { label: 'Returns & Exchanges', path: '/returns' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy-policy' }
  ];

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed with email:', email);
      setIsSubscribed(true);
      setEmail('');
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Animation variants are defined but not currently in use
  // Keeping the code clean by removing unused variables

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection $delay="0.1s">
          <h3>About Us</h3>
          <p>Your trusted partner for quality products and exceptional service. We're committed to delivering the best shopping experience.</p>
          <SocialLinks>
            <SocialLink 
              href="https://facebook.com" 
              aria-label="Facebook" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </SocialLink>
            <SocialLink 
              href="https://twitter.com" 
              aria-label="Twitter" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </SocialLink>
            <SocialLink 
              href="https://instagram.com" 
              aria-label="Instagram" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection $delay="0.2s">
          <h3>Quick Links</h3>
          <FooterList>
            {quickLinks.map((item) => (
              <FooterListItem key={item.path}>
                <FooterLink 
                  href={item.path}
                  onClick={handleNavigation(item.path)}
                >
                  {item.label}
                </FooterLink>
              </FooterListItem>
            ))}
          </FooterList>
        </FooterSection>

        <FooterSection $delay="0.3s">
          <h3>Customer Service</h3>
          <FooterList>
            {customerServiceLinks.map((item) => (
              <FooterListItem key={item.path}>
                <FooterLink 
                  href={item.path}
                  onClick={handleNavigation(item.path)}
                >
                  {item.label}
                </FooterLink>
              </FooterListItem>
            ))}
          </FooterList>
        </FooterSection>

        <FooterSection $delay="0.4s">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for the latest updates and exclusive offers.</p>
          {isSubscribed ? (
            <p style={{ color: '#2ecc71', marginTop: '1rem' }}>
              Thank you for subscribing!
            </p>
          ) : (
            <NewsletterForm onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit">Subscribe</Button>
            </NewsletterForm>
          )}
        </FooterSection>
      </FooterContent>

      <FooterBottom
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <PaymentMethods>
          <FaCcVisa size={30} style={{ color: '#fff' }} />
          <FaCcMastercard size={30} style={{ color: '#fff' }} />
          <FaCcPaypal size={30} style={{ color: '#fff' }} />
          <FaCcApplePay size={30} style={{ color: '#fff' }} />
          <SiAmericanexpress size={30} style={{ color: '#fff' }} />
        </PaymentMethods>
        <Copyright>
          &copy; {new Date().getFullYear()} VMK Online Store. All rights reserved.
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
