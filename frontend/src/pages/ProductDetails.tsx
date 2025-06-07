import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

import type { CartItem } from '../types/cart';

interface ProductBase {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  rating?: number;
  specifications?: Record<string, string>;
  countInStock?: number;
}

interface Product extends ProductBase {
  id: string | number;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/vmk_product_list_with_unsplash.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products: Product[] = await response.json();
        const foundProduct = products.find(p => String(p.id) === id);
        
        if (foundProduct) {
          // Transform the product to match our interface
          const productData: Product = {
            ...foundProduct,
            id: String(foundProduct.id), // Ensure ID is a string
            description: foundProduct.description || `${foundProduct.name} - High quality product`,
            image: foundProduct.image || 'https://via.placeholder.com/500x500?text=No+Image',
            category: foundProduct.category || 'Uncategorized',
            rating: foundProduct.rating || Math.floor(Math.random() * 2) + 4,
            countInStock: foundProduct.countInStock ?? 10 // Default stock value if undefined
          };
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        _id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
        image: product.image,
        qty: quantity,
        countInStock: product.countInStock || 10,
        product: product.id.toString() // Ensure product ID is a string
      };
      dispatch(addToCart(cartItem));
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '40px auto 0', 
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px'
    }}>
      <div className="product-image" style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain'
          }}
        />
      </div>
      
      <div className="product-info" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          margin: '0 0 10px 0',
          color: '#333'
        }}>{product.name}</h1>
        
        <p className="price" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#2d3748',
          margin: '10px 0'
        }}>
          {product.price}
        </p>
        
        <p className="description" style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#4a5568'
        }}>
          {product.description}
        </p>
        
        <div className="category" style={{
          marginTop: '10px',
          color: '#718096',
          fontSize: '0.9rem'
        }}>
          Category: {product.category}
        </div>
        
        {product.rating && (
          <div className="rating" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            margin: '10px 0'
          }}>
            <div style={{
              color: '#f6e05e',
              fontSize: '1.2rem',
              display: 'flex',
              gap: '2px'
            }}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span style={{ color: '#4a5568' }}>({product.rating.toFixed(1)})</span>
          </div>
        )}
        
        <div className="quantity-selector" style={{
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label htmlFor="quantity" style={{
            fontWeight: '500',
            color: '#4a5568'
          }}>Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={product.countInStock || 10}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{
              width: '70px',
              padding: '8px',
              border: '1px solid #cbd5e0',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          />
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={!product.countInStock}
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '20px'
          }}
          onMouseOver={(e) => {
            if (product?.countInStock) {
              e.currentTarget.style.backgroundColor = '#2c5282';
            }
          }}
          onMouseOut={(e) => {
            if (product?.countInStock) {
              e.currentTarget.style.backgroundColor = '#3182ce';
            } else {
              e.currentTarget.style.backgroundColor = '#a0aec0';
            }
          }}
        >
          {product.countInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      <div style={{
        gridColumn: '1 / -1',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '20px',
          color: '#2d3748'
        }}>
          Customer Reviews
        </h2>
        <p style={{
          color: '#718096',
          fontStyle: 'italic'
        }}>
          No reviews yet. Be the first to review!
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
