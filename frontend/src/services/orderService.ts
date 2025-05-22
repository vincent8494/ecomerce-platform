import { apiSlice } from '../store/api/apiSlice';
import { Order, PaginatedResponse, ShippingAddress } from '../types';

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      Order,
      {
        orderItems: Array<{
          product: string;
          name: string;
          image: string;
          price: number;
          qty: number;
        }>;
        shippingAddress: ShippingAddress;
        paymentMethod: string;
        itemsPrice: number;
        taxPrice: number;
        shippingPrice: number;
        totalPrice: number;
      }
    >({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => '/orders/myorders',
      providesTags: ['Order'],
    }),
    getAllOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: '/orders',
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      providesTags: ['Order'],
    }),
    payOrder: builder.mutation<
      Order,
      { orderId: string; paymentResult: { id: string; status: string; update_time: string; email_address: string } }
    >({
      query: ({ orderId, paymentResult }) => ({
        url: `/orders/${orderId}/pay`,
        method: 'PUT',
        body: paymentResult,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Order',
      ],
    }),
    deliverOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        'Order',
      ],
    }),
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Order',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApiSlice;
