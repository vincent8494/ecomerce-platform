import styled from 'styled-components';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

// Styled components
const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: #2c3e50;
`;

const PageTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 2px;
  }
`;

const ContactContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  line-height: 1.7;
`;

const ContactIntro = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  
  svg {
    color: #3498db;
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
`;

const ContactText = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
  }
  
  p, a {
    margin: 0;
    color: #7f8c8d;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: #3498db;
  }
`;

const BusinessHours = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  
  h3 {
    margin-top: 0;
    color: #2c3e50;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    margin: 0.5rem 0 0 2rem;
  }
`;

const Contact = () => {
  return (
    <ContactContainer>
      <PageTitle>Contact Us</PageTitle>
      
      <ContactContent>
        <ContactIntro>
          If you have any questions or concerns, feel free to reach out to us. Our team is here to help!
        </ContactIntro>
        
        <ContactList>
          <ContactItem>
            <FaEnvelope />
            <ContactText>
              <h3>Email</h3>
              <p>
                <a href="mailto:fettymikev@gmail.com">fettymikev@gmail.com</a>
              </p>
              <p>We typically respond within 24 hours during business days.</p>
            </ContactText>
          </ContactItem>
          
          <ContactItem>
            <FaPhone />
            <ContactText>
              <h3>Phone</h3>
              <p>
                <a href="tel:+254708996525">+254 708 996 525</a>
              </p>
              <p>Monday - Friday, 9:00 AM - 5:00 PM EAT</p>
            </ContactText>
          </ContactItem>
          
          <ContactItem>
            <FaMapMarkerAlt />
            <ContactText>
              <h3>Location</h3>
              <p>Nairobi, Kenya</p>
              <p>We operate online with worldwide shipping available.</p>
            </ContactText>
          </ContactItem>
        </ContactList>
        
        <BusinessHours>
          <h3><FaClock /> Business Hours</h3>
          <p>Monday - Friday: 9:00 AM - 5:00 PM EAT</p>
          <p>Saturday: 10:00 AM - 2:00 PM EAT</p>
          <p>Sunday: Closed</p>
        </BusinessHours>
      </ContactContent>
    </ContactContainer>
  );
};

export default Contact;
