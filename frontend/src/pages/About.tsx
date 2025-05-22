import styled from 'styled-components';

// Styled components
const AboutContainer = styled.div`
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

const AboutContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const Highlight = styled.span`
  color: #3498db;
  font-weight: 600;
`;

const MissionSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const ValuesList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const ValueItem = styled.li`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ValueTitle = styled.h3`
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '✓';
    color: #2ecc71;
    font-weight: bold;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <PageTitle>About VMK</PageTitle>
      
      <AboutContent>
        <p>
          <Highlight>VMK Online Store</Highlight> is a next-gen eCommerce store committed to style, tech, and trust. 
          We provide an exceptional range of curated products designed for your life. 
          Discover quality, convenience, and care — all in one place.
        </p>
        
        <MissionSection>
          <SectionTitle>Our Mission</SectionTitle>
          <p>
            To empower our customers by providing high-quality products, exceptional service, 
            and a seamless shopping experience that exceeds expectations.
          </p>
        </MissionSection>
        
        <SectionTitle>Our Values</SectionTitle>
        <ValuesList>
          <ValueItem>
            <ValueTitle>Quality First</ValueTitle>
            <p>We carefully select only the best products for our customers.</p>
          </ValueItem>
          <ValueItem>
            <ValueTitle>Customer Focus</ValueTitle>
            <p>Your satisfaction is our top priority.</p>
          </ValueItem>
          <ValueItem>
            <ValueTitle>Innovation</ValueTitle>
            <p>We stay ahead with the latest trends and technologies.</p>
          </ValueItem>
        </ValuesList>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;
