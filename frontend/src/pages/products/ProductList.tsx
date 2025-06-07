import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../hooks/useCart';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { useTranslation } from 'react-i18next';

// Define a type for our translation keys
type TranslationKey = 
  | 'common.search'
  | 'common.search_products'
  | 'common.categories'
  | 'common.price_range'
  | 'common.min_price'
  | 'common.max_price'
  | 'common.rating'
  | 'common.sort_by'
  | 'common.newest_first'
  | 'common.price_low_to_high'
  | 'common.price_high_to_low'
  | 'common.highest_rating'
  | 'common.error_loading_products';

// Helper object for type-safe key mapping
const TRANSLATION_KEYS = {
  search: 'search',
  search_products: 'search_products',
  categories: 'categories',
  price_range: 'price_range',
  min_price: 'min_price',
  max_price: 'max_price',
  rating: 'rating',
  sort_by: 'sort_by',
  newest_first: 'newest_first',
  price_low_to_high: 'price_low_to_high',
  price_high_to_low: 'price_high_to_low',
  highest_rating: 'highest_rating',
  error_loading_products: 'error_loading_products',
} as const;

// Type-safe key helper
const tKey = <K extends keyof typeof TRANSLATION_KEYS>(key: K): TranslationKey => 
  `common.${TRANSLATION_KEYS[key]}` as const;


const ProductList: React.FC = () => {
  const { t } = useTranslation();
  
  // Helper function to get translations with proper typing
  const getTranslation = (key: TranslationKey): string => t(key);
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  
  const setSearchParams = (updater: (prev: URLSearchParams) => URLSearchParams) => {
    const newParams = updater(new URLSearchParams(location.search));
    const searchString = newParams.toString();
    const newPath = searchString 
      ? `${location.pathname}?${searchString}`
      : location.pathname;
    history.push(newPath);
  };
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [rating, setRating] = useState<number>(0);

  const { products, loading, error, totalPages } = useProducts({
    page,
    category,
    search: searchTerm,
    sort,
    minPrice,
    maxPrice,
    rating,
  });

  const { categories } = useCategories();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleFilterChange = (field: string, value: string | number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(field, value.toString());
      return newParams;
    });

    switch (field) {
      case 'category':
        setCategory(value as string);
        break;
      case 'search':
        setSearchTerm(value as string);
        break;
      case 'sort':
        setSort(value as string);
        break;
      case 'minPrice':
        setMinPrice(Number(value));
        break;
      case 'maxPrice':
        setMaxPrice(Number(value));
        break;
      case 'rating':
        setRating(Number(value));
        break;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{getTranslation(tKey('error_loading_products'))}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{getTranslation(tKey('categories'))}</h3>
            <div className="space-y-2">
              {categories.map((cat: any) => (
                <button
                  key={cat._id}
                  onClick={() => handleFilterChange('category', cat._id)}
                  className={`w-full px-3 py-2 rounded-lg text-left ${
                    category === cat._id ? 'bg-blue-500 text-white' : 'text-gray-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{getTranslation(tKey('price_range'))}</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder={getTranslation(tKey('min_price'))}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder={getTranslation(tKey('max_price'))}
                  className="w-1/2 px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-1">{getTranslation(tKey('min_price'))}:</label>
                <label className="block text-sm font-medium text-gray-700 mb-1">{getTranslation(tKey('max_price'))}:</label>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">{getTranslation(tKey('rating'))}</h3>

            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleFilterChange('rating', star)}
                  className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating}+ ${getTranslation(tKey('rating'))}` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">{getTranslation(tKey('sort_by'))}</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange('sort', 'newest')}
              className={`w-full px-3 py-2 rounded-lg text-left ${
                sort === 'newest' ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              {getTranslation(tKey('newest_first'))}
            </button>
            <button
              onClick={() => handleFilterChange('sort', 'price_asc')}
              className={`w-full px-3 py-2 rounded-lg text-left ${
                sort === 'price_asc' ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              {getTranslation(tKey('price_low_to_high'))}
            </button>
            <button
              onClick={() => handleFilterChange('sort', 'price_desc')}
              className={`w-full px-3 py-2 rounded-lg text-left ${
                sort === 'price_desc' ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              {getTranslation(tKey('price_high_to_low'))}
            </button>
            <button
              onClick={() => handleFilterChange('sort', 'rating')}
              className={`w-full px-3 py-2 rounded-lg text-left ${
                sort === 'rating' ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              {getTranslation(tKey('highest_rating'))}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder={getTranslation(tKey('search_products'))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleFilterChange('search', searchTerm)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            {getTranslation(tKey('search'))}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage: number) => {
            setPage(newPage);
            setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.set('page', newPage.toString());
              return newParams;
            });
          }}
        />
      </div>
    </div>
  );
};

export default ProductList;
