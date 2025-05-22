import { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaTruck, FaCreditCard, FaGlobe, FaBoxOpen, FaUndo, FaLock } from 'react-icons/fa';

// Types
interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: 'orders' | 'shipping' | 'payments' | 'returns';
}

// Styled components
const FAQContainer = styled.div`
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

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  svg:first-child {
    margin-right: 1rem;
    color: #3498db;
    font-size: 1.2rem;
  }
`;

const Answer = styled.div<{ isOpen: boolean }>`
  padding: ${({ isOpen }) => (isOpen ? '1.5rem' : '0')} 1.5rem;
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  border-top: ${({ isOpen }) => (isOpen ? '1px solid #e9ecef' : 'none')};
  color: #7f8c8d;
  line-height: 1.7;
  
  p {
    margin: 0;
    padding: 0;
  }
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? '#3498db' : '#e0e6ed')};
  background: ${({ active }) => (active ? '#f0f7ff' : 'white')};
  color: ${({ active }) => (active ? '#3498db' : '#7f8c8d')};
  font-weight: ${({ active }) => (active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
      question: 'How can I track my order?',
      answer: 'Once your order has been shipped, you will receive a confirmation email with a tracking number and a link to track your package. You can also log in to your account to view the status of your order and track its progress.',
      icon: <FaTruck />,
      category: 'orders'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including Visa, MasterCard, PayPal, and mobile money (M-Pesa). All transactions are secure and encrypted for your protection.',
      icon: <FaCreditCard />,
      category: 'payments'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping fees and delivery times vary depending on your location. You can see the shipping cost at checkout before completing your purchase.',
      icon: <FaGlobe />,
      category: 'shipping'
    },
    {
      question: 'What is your return policy?',
      answer: 'You have 14 days from the date of delivery to return items for a refund or exchange. Items must be unused, in their original packaging, and in the same condition as received. Please see our Returns & Exchanges page for more details.',
      icon: <FaUndo />,
      category: 'returns'
    },
    {
      question: 'How long will it take to receive my order?',
      answer: 'Processing time is typically 1-2 business days. Domestic orders usually arrive within 2-5 business days after shipping. International orders typically take 7-14 business days. You will receive tracking information once your order ships.',
      icon: <FaBoxOpen />,
      category: 'shipping'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we take your security seriously. All payment information is encrypted using SSL technology and processed through secure payment gateways. We do not store your full credit card details on our servers.',
      icon: <FaLock />,
      category: 'payments'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: null },
    { id: 'orders', name: 'Orders', icon: <FaBoxOpen /> },
    { id: 'shipping', name: 'Shipping', icon: <FaTruck /> },
    { id: 'payments', name: 'Payments', icon: <FaCreditCard /> },
    { id: 'returns', name: 'Returns', icon: <FaUndo /> }
  ];

  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <FAQContainer>
      <PageTitle>Frequently Asked Questions</PageTitle>
      
      <Categories>
        {categories.map(category => (
          <CategoryButton
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.icon}
            {category.name}
          </CategoryButton>
        ))}
      </Categories>
      
      <FAQList>
        {filteredItems.map((item, index) => (
          <FAQItem key={index}>
            <Question onClick={() => toggleFAQ(index)}>
              <span>
                {item.icon}
                {item.question}
              </span>
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </Question>
            <Answer isOpen={activeIndex === index}>
              <p>{item.answer}</p>
            </Answer>
          </FAQItem>
        ))}
      </FAQList>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p>Still have questions? Contact our <a href="/contact" style={{ color: '#3498db', textDecoration: 'none' }}>customer support</a> team.</p>
      </div>
    </FAQContainer>
  );
};

export default FAQ;
