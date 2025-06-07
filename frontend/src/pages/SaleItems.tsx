import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getFallbackImage } from '../utils/imageUtils';

interface Product {
  id: string | number;
  name: string;
  price: string;
  image: string;
  category: string;
  originalPrice?: string;
  discount?: number;
}

// Styled components
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SaleBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e74c3c;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 1;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const ProductCategory = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const SalePrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #e74c3c;
`;

const OriginalPrice = styled.div`
  font-size: 1rem;
  color: #95a5a6;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #fde8e8;
  color: #e74c3c;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const PageTitle = styled.h1`
  text-align: center;
  margin: 2rem 0;
  color: #2c3e50;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
  background-color: #fde8e8;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
`;

const SaleItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/vmk_product_list_with_unsplash.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array of products');
        }
        
        // Get sale items (items 40-50) and add sale information
        const saleItems = data.slice(40, 50).map((product: any, index: number) => {
          const originalPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
          const discount = 10 + (index % 20); // Random discount between 10-30%
          const salePrice = (originalPrice * (1 - discount / 100)).toFixed(2);
          
          return {
            id: product.id || Math.random().toString(36).substr(2, 9),
            name: product.name || 'Unnamed Product',
            price: `$${salePrice}`,
            originalPrice: `$${originalPrice.toFixed(2)}`,
            discount,
            image: product.image || getFallbackImage(300, 200, 'No Image'),
            category: product.category || 'Uncategorized'
          };
        });
        
        setProducts(saleItems);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load sale items. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <LoadingMessage>Loading sale items...</LoadingMessage>;
  }

  if (error) {
    return (
      <ErrorMessage>
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </ErrorMessage>
    );
  }

  return (
    <div>
      <PageTitle>Sale Items</PageTitle>
      <ProductGrid>
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
            <ProductCard>
              <SaleBadge>SALE</SaleBadge>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductCategory>{product.category}</ProductCategory>
                <PriceContainer>
                  <SalePrice>{product.price}</SalePrice>
                  <OriginalPrice>{product.originalPrice}</OriginalPrice>
                  <DiscountBadge>-{product.discount}%</DiscountBadge>
                </PriceContainer>
              </ProductInfo>
            </ProductCard>
          </Link>
        ))}
      </ProductGrid>
    </div>
  );
};

export default SaleItems;
