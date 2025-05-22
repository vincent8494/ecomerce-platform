import { apiSlice } from '../store/api/apiSlice';
import { LoginFormData, RegisterFormData, User } from '../types';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; token: string }, LoginFormData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ user: User; token: string }, RegisterFormData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/auth/updatedetails',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updatePassword: builder.mutation<
      void,
      { currentPassword: string; newPassword: string }
    >({
      query: (passwords) => ({
        url: '/auth/updatepassword',
        method: 'PUT',
        body: passwords,
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgotpassword',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { password: string; token: string }
    >({
      query: ({ token, password }) => ({
        url: `/auth/resetpassword/${token}`,
        method: 'PUT',
        body: { password },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApiSlice;
