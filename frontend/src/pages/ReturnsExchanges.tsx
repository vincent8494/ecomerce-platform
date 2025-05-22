import styled from 'styled-components';
import { FaUndo, FaBoxOpen, FaExchangeAlt, FaShippingFast, FaMoneyBillWave } from 'react-icons/fa';

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

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 1.25rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e0e6ed;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  
  &::before {
    content: '';
    width: 1.5rem;
    height: 1.5rem;
    background: #3498db;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
`;

const TimelineContent = styled.div`
  margin-top: -0.25rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
  }
`;

const Note = styled.p`
  font-style: italic;
  color: #7f8c8d;
  margin: 1.5rem 0 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #e74c3c;
`;

const ReturnsExchanges = () => {
  return (
    <PolicyContainer>
      <PageTitle>Returns & Exchanges</PageTitle>
      
      <PolicyContent>
        <Section>
          <SectionTitle>
            <FaUndo />
            Our Return Policy
          </SectionTitle>
          
          <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.</p>
          
          <HighlightBox>
            <p><strong>You have 14 days</strong> from the date of delivery to return items for a refund or exchange.</p>
            <p>To be eligible for a return or exchange, your item must be:</p>
            <InfoList>
              <InfoItem>Unused and in the same condition as received</InfoItem>
              <InfoItem>In the original packaging with all tags attached</InfoItem>
              <InfoItem>Accompanied by the original receipt or proof of purchase</InfoItem>
            </InfoList>
          </HighlightBox>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaExchangeAlt />
            How to Return or Exchange
          </SectionTitle>
          
          <Timeline>
            <TimelineItem>
              <TimelineContent>
                <h3>Initiate Your Return</h3>
                <p>Contact our customer service team to initiate your return or exchange request.</p>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineContent>
                <h3>Package Your Item</h3>
                <p>Securely pack the item in its original packaging with all accessories and tags.</p>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineContent>
                <h3>Ship It Back</h3>
                <p>Send the package to our returns center using a trackable shipping service.</p>
              </TimelineContent>
            </TimelineItem>
            
            <TimelineItem>
              <TimelineContent>
                <h3>Receive Your Refund/Exchange</h3>
                <p>Once received and inspected, we'll process your refund or ship your exchange.</p>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaMoneyBillWave />
            Refund Information
          </SectionTitle>
          
          <InfoList>
            <InfoItem>Refunds will be processed within <strong>5 business days</strong> after receiving your return</InfoItem>
            <InfoItem>Shipping costs are non-refundable unless the return is due to our error</InfoItem>
            <InfoItem>Refunds will be issued to the original payment method</InfoItem>
            <InfoItem>Please allow additional time for your bank or credit card company to process the refund</InfoItem>
          </InfoList>
          
          <Note>
            <strong>Note:</strong> Sale items, intimate apparel, and personalized items are final sale and cannot be returned or exchanged unless defective.
          </Note>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaBoxOpen />
            Exchange Policy
          </SectionTitle>
          
          <p>We're happy to exchange items for a different size or color, subject to availability. If the item you want is not available, we'll issue a refund instead.</p>
          
          <InfoList>
            <InfoItem>Exchanges are subject to product availability</InfoItem>
            <InfoItem>You are responsible for return shipping costs on exchanges</InfoItem>
            <InfoItem>If the new item is of higher value, you'll be charged the difference</InfoItem>
          </InfoList>
        </Section>
        
        <Section>
          <SectionTitle>
            <FaShippingFast />
            Return Shipping
          </SectionTitle>
          
          <p>Customers are responsible for return shipping costs unless the return is due to our error. We recommend using a trackable shipping service as we cannot be responsible for items lost or damaged in return transit.</p>
          
          <Note>
            <strong>Tip:</strong> For your protection, we recommend insuring your return package in case it's lost or damaged in transit.
          </Note>
        </Section>
      </PolicyContent>
    </PolicyContainer>
  );
};

export default ReturnsExchanges;
