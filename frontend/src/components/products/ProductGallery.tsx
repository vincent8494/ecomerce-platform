import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getFallbackImage } from '../../utils/imageUtils';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description?: string;
  rating?: number;
  originalPrice?: string; // Add optional originalPrice field
}

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.article`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #edf2f7;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #e60023, #ff4d4d);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #e2e8f0;

    &::before {
      opacity: 1;
    }
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s ease;
  background: #f8f9fa;
  border-bottom: 1px solid #f1f5f9;

  ${ProductCard}:hover & {
    transform: scale(1.03);
  }
`;

const ProductInfo = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ProductCategory = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 8px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
`;

const FiltersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #edf2f7;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  flex: 1;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.25rem;
`;

const PriceRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
  max-width: 80px;

  &:focus {
    outline: none;
    border-color: #e60023;
    box-shadow: 0 0 0 2px rgba(230, 0, 35, 0.1);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex: 1;
  max-width: 400px;
  
  svg {
    color: #666;
    margin-right: 0.5rem;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  
  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;
  background-size: 1em auto;
  padding-right: 2.5em;
  
  &:hover {
    border-color: #999;
  }
  
  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const NoProductsMessage = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.1rem;
  color: #666;
  background: white;
  border-radius: 12px;
  margin: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  color: #e60023;
  font-weight: 700;
  margin: 0.5rem 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  &::before {
    content: '$';
    font-size: 0.9em;
    opacity: 0.8;
    margin-right: 2px;
  }
`;

// Remove unused ProductDescription styled component

const Rating = styled.div`
  color: #ffc107;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  
  span {
    color: #666;
    margin-left: 0.5rem;
    font-size: 0.85rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 3rem 0 1rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0 1rem;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.active ? '#e60023' : '#ddd'};
  background: ${props => props.active ? '#e60023' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#e60023' : '#f8f8f8'};
    border-color: ${props => props.active ? '#e60023' : '#999'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsCount = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.2rem;
  color: #4a5568;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: #d32f2f;
  background: #ffebee;
  border-left: 4px solid #f44336;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: 100%;
  border: 1px solid #edf2f7;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 220px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
`;

const SkeletonText = styled.div<{ width?: string }>`
  height: 1rem;
  background: #f0f0f0;
  margin: 0.5rem 1rem;
  border-radius: 4px;
  width: ${props => props.width || '80%'};
`;

const SkeletonButton = styled(SkeletonText)`
  height: 2rem;
  margin: 1rem;
  border-radius: 8px;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

interface ProductGalleryProps {
  initialSearchTerm?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ initialSearchTerm = '' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const productsPerPage = 12;

  // Fetch products from the JSON file
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Import the JSON file directly
        const response = await fetch('/vmk_product_list_with_unsplash.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid product data format');
        }
        
        // Transform the data to match our Product interface
        const formattedProducts: Product[] = data.map(item => ({
          id: item.id,
          name: item.name || 'Unnamed Product',
          price: item.price || '$0.00',
          category: item.category || 'Uncategorized',
          image: item.image || getFallbackImage(300, 200, 'No Image'),
          description: item.description || `A high-quality ${item.name || 'product'}.`,
          rating: Math.floor(Math.random() * 3) + 3, // Random rating 3-5
          originalPrice: item.originalPrice || ''
        }));
        
        // Calculate price range for filter
        if (formattedProducts.length > 0) {
          const prices = formattedProducts.map(p => parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0);
          const minPrice = Math.floor(Math.min(...prices) / 10) * 10; // Round down to nearest 10
          const maxPrice = Math.ceil(Math.max(...prices) / 10) * 10; // Round up to nearest 10
          setPriceRange([minPrice, maxPrice]);
        }
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        setError(null);
      } catch (error) {
        console.error('Error loading product catalog:', error);
        setError('Failed to load product catalog. Please refresh the page to try again.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories and update price range when products change
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        cats.add(product.category);
      }
    });
    return ['all', ...Array.from(cats).sort()];
  }, [products]);
  
  // Update price range when filtered products change
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const prices = filteredProducts.map(p => parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0);
      if (prices.length > 0) {
        const currentMin = Math.min(...prices);
        const currentMax = Math.max(...prices);
        if (currentMin > priceRange[0] || currentMax < priceRange[1]) {
          setPriceRange([
            Math.max(priceRange[0], Math.floor(currentMin / 10) * 10),
            Math.min(priceRange[1], Math.ceil(currentMax / 10) * 10)
          ]);
        }
      }
    }
  }, [filteredProducts]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        product.category.toLowerCase().includes(term)
      );
    }

    // Apply price filter
    result = result.filter(product => {
      const price = parseFloat((product.price || '0').replace(/[^0-9.]/g, ''));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
        case 'price-desc':
          return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <>
        <LoadingMessage>Loading products...</LoadingMessage>
        <LoadingGrid>
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index}>
              <SkeletonImage />
              <SkeletonText width="70%" />
              <SkeletonText width="50%" />
              <SkeletonText width="60%" />
              <SkeletonButton />
            </SkeletonCard>
          ))}
        </LoadingGrid>
      </>
    );
  }

  if (error) {
    return (
      <ErrorMessage>
        <div>Error loading products</div>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1.25rem',
            background: '#e60023',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#d5001f'}
          onMouseOut={(e) => e.currentTarget.style.background = '#e60023'}
        >
          Retry
        </button>
      </ErrorMessage>
    );
  }

  return (
    <div>
      <Toolbar>
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Search</FilterLabel>
            <SearchContainer>
              <FaSearch />
              <SearchInput 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
            </SearchContainer>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Category</FilterLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((category: string) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Price Range</FilterLabel>
            <PriceRangeContainer>
              <PriceInput
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                aria-label="Minimum price"
              />
              <span>to</span>
              <PriceInput
                type="number"
                min={priceRange[0]}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                aria-label="Maximum price"
              />
            </PriceRangeContainer>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sort By</FilterLabel>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              aria-label="Sort products"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Top Rated</option>
            </Select>
          </FilterGroup>
        </FiltersContainer>
      </Toolbar>

      {filteredProducts.length === 0 ? (
        <NoProductsMessage>No products found matching your criteria.</NoProductsMessage>
      ) : (
        <>
          <ProductGrid>
            {currentProducts.map((product) => (
              <ProductCard key={product.id} role="article" aria-label={`Product: ${product.name}`}>
                <ProductImage 
                  src={product.image || getFallbackImage(300, 200, 'No Image')}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage(300, 200, 'Image Not Available');
                  }}
                />
                <ProductInfo>
                  <ProductName>
  <a href={`/product/${product.id}`} aria-label={`View details for ${product.name}`}>
    {product.name}
  </a>
</ProductName>
                  <ProductCategory>{product.category}</ProductCategory>
                  <ProductPrice>
                    {parseFloat(product.price.replace(/[^0-9.]/g, '')).toFixed(2)}
                    {product.originalPrice && (
                      <span style={{
                        textDecoration: 'line-through',
                        color: '#a0aec0',
                        fontSize: '0.9rem',
                        marginLeft: '0.5rem',
                        fontWeight: 'normal'
                      }}>
                        ${parseFloat(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </ProductPrice>
                  {product.rating && product.rating > 0 ? (
                    <Rating>
                      {'★'.repeat(Math.round(product.rating))}
                      {'☆'.repeat(5 - Math.round(product.rating))}
                      <span>({product.rating.toFixed(1)})</span>
                    </Rating>
                  ) : null}
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationButton 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </PaginationButton>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationButton
                    key={pageNum}
                    active={pageNum === currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PaginationButton>
                );
              })}
              
              <PaginationButton 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </PaginationButton>
            </Pagination>
          )}
          
          <ResultsCount>
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </ResultsCount>
        </>
      )}
    </div>
  );
};

export default ProductGallery;
