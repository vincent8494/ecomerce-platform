import styled from 'styled-components';
import { FaLock, FaShieldAlt, FaUserShield, FaEnvelope, FaTrash } from 'react-icons/fa';

// Styled components
const PolicyContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: #2c3e50;
  line-height: 1.7;
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

const PolicyContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 2rem 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #3498db;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const InfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '•';
    color: #3498db;
    font-weight: bold;
    font-size: 1.5rem;
    position: absolute;
    left: 0;
    line-height: 1;
  }
`;

const HighlightBox = styled.div`
  background: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 1.5rem;
  border-radius: 0 8px 8px 0;
  margin: 2rem 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    font-size: 2rem;
    color: #3498db;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin: 0 0 0.75rem;
    color: #2c3e50;
  }
  
  p {
    color: #7f8c8d;
    margin: 0;
    font-size: 0.95rem;
  }
`;

const LastUpdated = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 3rem;
`;

const PrivacyPolicy = () => {
  return (
    <PolicyContainer>
      <PageTitle>Privacy Policy</PageTitle>
      
      <PolicyContent>
        <Section>
          <p>Welcome to VMK Online Store. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.</p>
          
          <HighlightBox>
            <p>Your privacy is important to us. We collect only the necessary data to process your order and provide a personalized shopping experience.</p>
          </HighlightBox>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaShieldAlt />
            Information We Collect
          </SectionTitle>
          
          <p>We may collect the following types of information:</p>
          
          <InfoList>
            <InfoItem><strong>Personal Information:</strong> Name, email address, phone number, shipping/billing address</InfoItem>
            <InfoItem><strong>Payment Information:</strong> Credit card details (processed securely through our payment processors)</InfoItem>
            <InfoItem><strong>Order Information:</strong> Products purchased, order history, preferences</InfoItem>
            <InfoItem><strong>Device & Usage Data:</strong> IP address, browser type, pages visited, referring/exit pages</InfoItem>
          </InfoList>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaLock />
            How We Use Your Information
          </SectionTitle>
          
          <p>We use your information for the following purposes:</p>
          
          <FeatureGrid>
            <FeatureCard>
              <FaUserShield />
              <h3>Order Processing</h3>
              <p>To process and fulfill your orders, send order confirmations, and provide customer support.</p>
            </FeatureCard>
            
            <FeatureCard>
              <FaEnvelope />
              <h3>Communication</h3>
              <p>To send important account-related updates, order status, and respond to your inquiries.</p>
            </FeatureCard>
            
            <FeatureCard>
              <FaShieldAlt />
              <h3>Security</h3>
              <p>To protect against fraudulent transactions and ensure the security of our services.</p>
            </FeatureCard>
            
            <FeatureCard>
              <FaTrash />
              <h3>Data Retention</h3>
              <p>We retain your personal information only as long as necessary to provide our services.</p>
            </FeatureCard>
          </FeatureGrid>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaUserShield />
            Your Privacy Rights
          </SectionTitle>
          
          <p>You have the right to:</p>
          
          <InfoList>
            <InfoItem>Access, update, or delete your personal information</InfoItem>
            <InfoItem>Opt-out of marketing communications</InfoItem>
            <InfoItem>Request a copy of your data</InfoItem>
            <InfoItem>Withdraw consent for data processing</InfoItem>
          </InfoList>
          
          <p>To exercise these rights, please contact us at <a href="mailto:fettymikev@gmail.com" style={{color: '#3498db', textDecoration: 'none'}}>fettymikev@gmail.com</a>.</p>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaLock />
            Data Security
          </SectionTitle>
          
          <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
          
          <InfoList>
            <InfoItem>SSL/TLS encryption for data transmission</InfoItem>
            <InfoItem>Secure payment processing through trusted providers</InfoItem>
            <InfoItem>Regular security assessments and updates</InfoItem>
            <InfoItem>Limited access to personal information on a need-to-know basis</InfoItem>
          </InfoList>
          
          <HighlightBox>
            <InfoList>
              <InfoItem>We do not sell or share your personal information with third parties for marketing purposes without your consent.</InfoItem>
              <InfoItem>All payments are processed through secure third-party gateways that comply with PCI-DSS standards.</InfoItem>
              <InfoItem>You can request to view, update, or delete your data at any time by contacting us.</InfoItem>
            </InfoList>
          </HighlightBox>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaShieldAlt />
            Changes to This Policy
          </SectionTitle>
          
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaEnvelope />
            Contact Us
          </SectionTitle>
          
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: <a href="mailto:fettymikev@gmail.com" style={{color: '#3498db', textDecoration: 'none'}}>fettymikev@gmail.com</a></p>
        </Section>
        
        <LastUpdated>Last Updated: May 22, 2025</LastUpdated>
      </PolicyContent>
    </PolicyContainer>
  );
};

export default PrivacyPolicy;
