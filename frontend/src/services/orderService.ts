import { apiSlice } from '../store/api/apiSlice';
import type { Order, PaginatedResponse, ShippingAddress } from '../types';

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
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    getMyOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/orders/myorders',
        params: { page, limit },
      }),
      providesTags: (_result) =>
        _result
          ? [
              ..._result.data.map((order) => ({ type: 'Order' as const, id: order._id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    getAllOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: '/orders',
        params,
      }),
      providesTags: (_result) =>
        _result
          ? [
              ..._result.data.map((order) => ({
                type: 'Order' as const,
                id: order._id,
              })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
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
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Order',
      ],
    }),
    updateOrderToDelivered: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/orders/${id}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'User', id: 'ORDERS' },
      ],
    }),
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: 'Order', id: orderId },
        'Order',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  usePayOrderMutation,
  useUpdateOrderToDeliveredMutation,
  useUpdateOrderStatusMutation,
} = orderApiSlice;
