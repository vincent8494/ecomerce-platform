import { apiSlice } from '../store/api/apiSlice';
import { Product, PaginatedResponse } from '../types';

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      PaginatedResponse<Product>,
      {
        page?: number;
        limit?: number;
        keyword?: string;
        category?: string;
        brand?: string;
        minPrice?: number;
        maxPrice?: number;
        rating?: number;
        sort?: string;
      }
    >({
      query: (params = {}) => ({
        url: '/products',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.keyword && { keyword: params.keyword }),
          ...(params.category && { category: params.category }),
          ...(params.brand && { brand: params.brand }),
          ...(params.minPrice && { 'price[gte]': params.minPrice }),
          ...(params.maxPrice && { 'price[lte]': params.maxPrice }),
          ...(params.rating && { 'ratings[gte]': params.rating }),
          ...(params.sort && { sort: params.sort }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
              'Product',
            ]
          : ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; productData: FormData }
    >({
      query: ({ id, productData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation<{ image: string }, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/products/${id}/photo`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),
    createProductReview: builder.mutation<
      void,
      { productId: string; rating: number; comment: string }
    >({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'Product',
      ],
    }),
    getTopProducts: builder.query<Product[], void>({
      query: () => '/products/top',
      providesTags: ['Product'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
} = productApiSlice;
