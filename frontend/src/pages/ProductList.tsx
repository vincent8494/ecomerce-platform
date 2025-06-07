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
  const { category = '' } = queryString.parse(location.search);

  return (
    <PageContainer>
      <PageTitle>Our Products</PageTitle>
      <ProductGallery initialSearchTerm={category} />
    </PageContainer>
  );
};

export default ProductList;
