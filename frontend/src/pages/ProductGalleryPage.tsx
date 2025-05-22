import React from 'react';
import styled from 'styled-components';
import ProductGallery from '../components/products/ProductGallery';

const PageContainer = styled.div`
  padding: 20px 0;
  background: #f5f5f5;
  min-height: calc(100vh - 80px); // Adjust based on your header height
`;

const PageTitle = styled.h1`
  text-align: center;
  margin: 20px 0 30px;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
`;

const ProductGalleryPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>VMK Product Gallery</PageTitle>
      <ProductGallery />
    </PageContainer>
  );
};

export default ProductGalleryPage;
