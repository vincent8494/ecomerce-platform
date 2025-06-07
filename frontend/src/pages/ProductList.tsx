import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import styled from 'styled-components';
import ProductGallery from '../components/products/ProductGallery';

const PageContainer = styled.div`
  padding: 20px 0;
  background: #f5f5f5;
  min-height: calc(100vh - 80px);
`;

const PageTitle = styled.h1`
  text-align: center;
  margin: 20px 0 30px;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
`;

const ProductList: React.FC = () => {
  const location = useLocation();
  const { category } = queryString.parse(location.search);
  // Convert category to string or undefined, handling all possible types from queryString.parse
  const searchTerm = (() => {
    if (!category) return undefined;
    if (Array.isArray(category)) return category[0] || undefined;
    return String(category); // Ensure we return a string, not string | null
  })();

  return (
    <PageContainer>
      <PageTitle>Our Products</PageTitle>
      <ProductGallery initialSearchTerm={searchTerm} />
    </PageContainer>
  );
};

export default ProductList;
