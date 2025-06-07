import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import type { CSSProperties } from 'react';

interface Product {
  id: string | number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  countInStock?: number;
}

type CSSObject = CSSProperties & {
  [key: string]: CSSProperties | string | number | CSSObject | undefined;
};

const Home = () => {
  // Navigation
  const history = useHistory();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | number | null>(null);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/products?search=${searchTerm}`);
    }
  };

  // Fetch featured products
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
        
        // Transform and set products
        const products: Product[] = data.slice(0, 8).map((product: any) => ({
          id: product.id || Math.random().toString(36).substr(2, 9),
          name: product.name || 'Unnamed Product',
          price: product.price || '$0.00',
          image: product.image || 'https://via.placeholder.com/300x200?text=No+Image',
          category: product.category || 'Uncategorized',
          description: product.description || `${product.name || 'Product'} - High quality product`,
          rating: product.rating || Math.floor(Math.random() * 2) + 4,
          countInStock: product.countInStock || 0
        }));
        
        setFeaturedProducts(products);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div>Loading featured products...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div style={styles.errorContainer}>
        <h2>Error Loading Products</h2>
        <p>We couldn't load the featured products. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()}
          style={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            style={{
              ...styles.searchInput,
              ...(isSearchFocused ? styles.searchInputFocus : {}),
            }}
          />
          <button 
            type="submit" 
            style={{
              ...styles.searchButton,
              ...(isSearchHovered ? styles.searchButtonHover : {})
            }}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
          >
            <Search />
          </button>
        </form>
      </div>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to VMK Store</h1>
          <p style={styles.heroSubtitle}>Discover amazing products at great prices</p>
          <div style={styles.heroButtons}>
            <Link to="/products" style={styles.primaryButton}>
              Shop Now
            </Link>
            <Link to="/categories" style={styles.secondaryButton}>
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <div style={styles.productsGrid}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div 
                key={product.id} 
                style={{
                  ...styles.productCard,
                  ...(hoveredProduct === product.id ? styles.productCardHover : {})
                }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={styles.imageContainer}>
                  <img 
                    src={product.image}
                    alt={product.name}
                    style={{
                      ...styles.productImage,
                      transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                    }}
                  />
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productPrice}>
                    {product.price.startsWith('$') ? product.price : `$${product.price}`}
                  </p>
                  {product.rating && (
                    <div style={styles.rating}>
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                      <span style={styles.ratingText}>({product.rating.toFixed(1)})</span>
                    </div>
                  )}
                  <button 
                    onClick={() => history.push(`/product/${product.id}`)}
                    style={styles.viewButton}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noProducts}>
              <p>No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Styles
const styles: Record<string, CSSObject> = {
  // Layout
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    lineHeight: 1.6,
    color: '#333',
  },
  
  // Search bar
  searchContainer: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  searchForm: {
    display: 'flex',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    padding: '0.8rem 1.2rem',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
  searchInputFocus: {
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    transform: 'translateY(-1px)',
  },
  searchButton: {
    position: 'absolute',
    right: '25px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    color: '#2c3e50',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  searchButtonHover: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  
  // Loading and error states
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
    color: '#666',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    padding: '20px',
    textAlign: 'center',
    color: '#d32f2f',
  },
  retryButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#3182ce',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  
  // Hero section
  hero: {
    background: 'linear-gradient(135deg, #3498db, #2c3e50)',
    color: 'white',
    padding: '6rem 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.3)',
      zIndex: 1,
      borderRadius: '8px',
    },
  },

  // ... rest of the styles remain the same ...

  primaryButton: {
    backgroundColor: 'white',
    color: '#2c3e50',
    padding: '12px 30px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
  },

  // ... rest of the styles remain the same ...

  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  // ... rest of the styles remain the same ...

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '40px 30px',
    padding: '0 10px',
    width: '100%',
    boxSizing: 'border-box',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '30px 20px',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
      gap: '30px',
      padding: '0',
    },
  },

  // ... rest of the styles remain the same ...

  noProducts: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    margin: '10px 0',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      padding: '40px 20px',
    }
  },
};

export default Home;
