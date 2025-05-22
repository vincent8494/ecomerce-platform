import styled from 'styled-components';
import { FaTruck, FaClock, FaEnvelope, FaGlobe } from 'react-icons/fa';

// Styled components
const PolicyContainer = styled.div`
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

const PolicyContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  line-height: 1.7;
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
  margin-bottom: 1.5rem;
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

const Note = styled.p`
  font-style: italic;
  color: #7f8c8d;
  margin: 1.5rem 0 0;
`;

const ShippingPolicy = () => {
  return (
    <PolicyContainer>
      <PageTitle>Shipping Policy</PageTitle>
      
      <PolicyContent>
        <Section>
          <SectionTitle>
            <FaTruck />
            Order Processing & Delivery Times
          </SectionTitle>
          
          <p>We strive to process and ship your order as quickly as possible. Here's what you can expect:</p>
          
          <InfoList>
            <InfoItem>Orders are typically processed within <strong>1-2 business days</strong> (Monday-Friday, excluding public holidays)</InfoItem>
            <InfoItem>Once shipped, you'll receive a confirmation email with tracking information</InfoItem>
            <InfoItem>Please allow additional time for order verification and processing during peak seasons</InfoItem>
          </InfoList>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaGlobe />
            Shipping Options & Delivery Times
          </SectionTitle>
          
          <p>Delivery times vary based on your location and the shipping method selected at checkout:</p>
          
          <HighlightBox>
            <h3>Standard Shipping</h3>
            <InfoList>
              <InfoItem>
                <strong>Domestic (Kenya):</strong> 2-5 business days
              </InfoItem>
              <InfoItem>
                <strong>East Africa:</strong> 3-7 business days
              </InfoItem>
              <InfoItem>
                <strong>International:</strong> 7-14 business days
              </InfoItem>
            </InfoList>
            
            <Note>Delivery times are estimates and may vary due to factors beyond our control, such as customs processing.</Note>
          </HighlightBox>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaEnvelope />
            Order Tracking
          </SectionTitle>
          
          <p>Once your order has been shipped, you will receive a shipping confirmation email that includes:</p>
          
          <InfoList>
            <InfoItem>Your tracking number</InfoItem>
            <InfoItem>Link to track your package</InfoItem>
            <InfoItem>Estimated delivery date</InfoItem>
            <InfoItem>Shipping carrier information</InfoItem>
          </InfoList>
          
          <Note>Please allow up to 24 hours for tracking information to update in the carrier's system.</Note>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaClock />
            Important Notes
          </SectionTitle>
          
          <InfoList>
            <InfoItem>We are not responsible for any delays caused by incorrect or incomplete shipping information</InfoItem>
            <InfoItem>Some remote areas may experience longer delivery times</InfoItem>
            <InfoItem>Customs fees, taxes, and duties are the responsibility of the customer for international orders</InfoItem>
            <InfoItem>Delivery times may be extended during holidays and peak seasons</InfoItem>
          </InfoList>
        </Section>
      </PolicyContent>
    </PolicyContainer>
  );
};

export default ShippingPolicy;
