import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import type { CSSProperties } from 'react';
import { getFallbackImage } from '../utils/imageUtils';
import '../styles/productCard.css';

interface Product {
  id: string | number;
  name: string;
  price: string;
  originalPrice?: string;
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
  const history = useHistory();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Removed unused state to fix TypeScript warning

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/products?search=${searchTerm}`);
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/vmk_product_list_with_unsplash.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data to match our Product interface
        const formattedProducts: Product[] = data.map((item: any) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          name: item.name || 'Unnamed Product',
          price: item.price || '$0.00',
          originalPrice: item.originalPrice,
          image: item.image || getFallbackImage({
            width: 300,
            height: 300,
            text: 'No Image',
            bgColor: '#f8f9fa',
            textColor: '6c757d',
            tilePattern: true
          }),
          category: item.category || 'Uncategorized',
          description: item.description || `${item.name || 'Product'} - High quality product`,
          rating: item.rating || Math.floor(Math.random() * 2) + 4,
          countInStock: item.countInStock ?? 10
        }));
        
        setProducts(formattedProducts);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      {/* Search Section */}
      <section style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <h1 style={styles.heroTitle}>Find Your Perfect Product</h1>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInputContainer}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Removed focus/blur handlers as they were using removed state
                style={styles.searchInput}
              />
            </div>
            <button type="submit" style={styles.searchButton}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Products Grid */}
      <section style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Our Products</h2>
        {isLoading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = getFallbackImage({
                        width: 300,
                        height: 300,
                        text: 'Image Not Available',
                        bgColor: '#f8f9fa',
                        textColor: '6c757d',
                        tilePattern: true
                      });
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">
                    {product.price.startsWith('$') ? product.price : `$${product.price}`}
                    {product.originalPrice && (
                      <span className="original-price">{product.originalPrice}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="rating">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} style={i < product.rating! ? styles.starFilled : styles.starEmpty}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="product-actions">
                    <button className="add-to-cart-btn">Add to Cart</button>
                    <button className="wishlist-btn" aria-label="Add to wishlist">
                      ♡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Styles
const styles: Record<string, CSSObject> = {
  // Layout
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    lineHeight: 1.6,
    color: '#333',
  },
  
  // Search Section
  searchSection: {
    backgroundColor: '#f8f9fa',
    padding: '60px 0',
    marginBottom: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  
  searchContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '0 20px',
  },
  
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: '20px',
    lineHeight: 1.2,
  },
  
  searchForm: {
    display: 'flex',
    gap: '10px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  
  searchInputContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '0 15px',
    transition: 'border-color 0.3s ease',
  },
  
  searchIcon: {
    color: '#95a5a6',
    marginRight: '10px',
  },
  
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '12px 0',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    '&::placeholder': {
      color: '#95a5a6',
    }
  } as unknown as CSSObject,
  
  searchButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0 24px',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#2980b9',
    }
  } as unknown as CSSObject,
  
  // Products Section
  productsSection: {
    padding: '40px 0',
  },
  
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: '30px',
    position: 'relative',
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: 0,
      width: '60px',
      height: '4px',
      backgroundColor: '#3498db',
      borderRadius: '2px',
    } as CSSProperties,
  },
  
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
    padding: '24px 0',
  },
  
  // Loading and Error States
  loading: {
    textAlign: 'center',
    padding: '40px 0',
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  
  error: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#e74c3c',
    fontSize: '1.1rem',
  },
  
  // Star Rating
  starFilled: {
    color: '#f1c40f',
    fontSize: '1rem',
  },
  
  starEmpty: {
    color: '#ddd',
    fontSize: '1rem',
  },
  
  // Responsive Adjustments
  '@media (max-width: 768px)': {
    heroTitle: {
      fontSize: '2rem',
    },
    searchForm: {
      flexDirection: 'column',
      gap: '10px',
    },
    searchInputContainer: {
      width: '100%',
    },
    searchButton: {
      width: '100%',
      padding: '12px 0',
    },
    productsGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '16px',
    },
  } as unknown as CSSObject,
  
  '@media (max-width: 480px)': {
    container: {
      padding: '0 10px',
    },
    heroTitle: {
      fontSize: '1.75rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
    },
    productsGrid: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  } as unknown as CSSObject,
};

export default Home;
