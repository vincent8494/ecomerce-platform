import { apiSlice } from '../store/api/apiSlice';
import { Category, PaginatedResponse } from '../types';

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<PaginatedResponse<Category>, { page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: '/categories',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Category' as const,
                id: _id,
              })),
              'Category',
            ]
          : ['Category'],
    }),
    getAllCategories: builder.query<Category[], void>({
      query: () => '/categories?limit=100',
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: ['Category'],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createCategory: builder.mutation<Category, FormData>({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; categoryData: FormData }
    >({
      query: ({ id, categoryData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        'Category',
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    uploadCategoryImage: builder.mutation<{ image: string }, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/categories/${id}/photo`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),
    getFeaturedCategories: builder.query<Category[], void>({
      query: () => '/categories/featured',
      providesTags: ['Category'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  useGetFeaturedCategoriesQuery,
} = categoryApiSlice;
