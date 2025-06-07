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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
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

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
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

const NewArrivals = () => {
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
        
        // Get the 10 newest products
        const newArrivals = data.slice(0, 10).map((product: any) => ({
          id: product.id || Math.random().toString(36).substr(2, 9),
          name: product.name || 'Unnamed Product',
          price: product.price || '$0.00',
          image: product.image || getFallbackImage(300, 200, 'No Image'),
          category: product.category || 'Uncategorized'
        }));
        
        setProducts(newArrivals);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load new arrivals. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <LoadingMessage>Loading new arrivals...</LoadingMessage>;
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
      <PageTitle>New Arrivals</PageTitle>
      <ProductGrid>
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none' }}>
            <ProductCard>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductPrice>{product.price}</ProductPrice>
              </ProductInfo>
            </ProductCard>
          </Link>
        ))}
      </ProductGrid>
    </div>
  );
};

export default NewArrivals;
