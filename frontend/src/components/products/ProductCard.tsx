import React from 'react';
import { Link } from 'react-router-dom';
// useWishlist hook is not available, implementing a simple version
const useWishlist = () => {
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  
  const addToWishlist = (product: any) => {
    if (!wishlist.includes(product._id)) {
      setWishlist([...wishlist, product._id]);
    }
  };
  
  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(id => id !== productId));
  };
  
  const isInWishlist = (productId: string) => wishlist.includes(productId);
  
  return { addToWishlist, removeFromWishlist, isInWishlist };
};
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Wishlist button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100"
        >
          <svg
            className={`h-5 w-5 ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-400'}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800">
          <Link to={`/products/${product._id}`} className="hover:text-blue-600">
            {product.name}
          </Link>
        </h3>

        {/* Price */}
        <div className="mt-2">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          {product.discount && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${((product.price * product.discount) / 100 + product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`h-4 w-4 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            ({product.reviews.length})
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('common.add_to_cart' as any)}
          </button>
          <Link
            to={`/products/${product._id}`}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            {t('common.view_details' as any)}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
