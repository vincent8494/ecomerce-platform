import { apiSlice } from '../store/api/apiSlice';
import type { Category, PaginatedResponse } from '../types';

interface GetCategoriesArgs {
  page?: number;
  limit?: number;
  [key: string]: unknown; // Allow additional properties
}

interface UpdateCategoryArgs {
  id: string;
  categoryData: FormData;
}

interface UploadCategoryImageArgs {
  id: string;
  file: File;
}


const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], GetCategoriesArgs | void>({
      query: (args = {}) => {
        const typedArgs = args as GetCategoriesArgs;
        const { page = 1, limit = 10 } = typedArgs;
        return {
          url: '/categories',
          params: { page, limit },
        };
      },
      transformResponse: (response: PaginatedResponse<Category>) => response.data,
      providesTags: (result = []) => [
        'Category',
        ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
      ],
    }),
    getAllCategories: builder.query<Category[], void>({
      query: () => '/categories?limit=100',
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: (result: Category[] = []) => [
        'Category',
        ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
      ],
    }),
    getCategory: builder.query<Category, string>({
      query: (id: string) => `/categories/${id}`,
      providesTags: (_result: Category | undefined, _error: unknown, id: string) => [
        { type: 'Category' as const, id },
      ],
    }),
    createCategory: builder.mutation<Category, FormData>({
      query: (categoryData: FormData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, UpdateCategoryArgs>({
      query: ({ id, categoryData }: UpdateCategoryArgs) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (_result: Category | undefined, _error: unknown, { id }: { id: string }) => [
        { type: 'Category' as const, id },
        'Category',
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result: void, _error: unknown, id: string) => [
        { type: 'Category' as const, id },
        'Category',
      ],
    }),
    uploadCategoryImage: builder.mutation<{ image: string }, UploadCategoryImageArgs>({
      query: ({ id, file }: UploadCategoryImageArgs) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/categories/${id}/photo`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result: unknown, _error: unknown, { id }: { id: string }) => [
        { type: 'Category' as const, id },
      ],
    }),
    getFeaturedCategories: builder.query<Category[], void>({
      query: () => '/categories/featured',
      providesTags: (result: Category[] = []) => [
        'Category',
        ...result.map(({ _id }) => ({ type: 'Category' as const, id: _id })),
      ],
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
