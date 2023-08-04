import { createSlice } from '@reduxjs/toolkit';
import { payOrders } from './asyncOperations';
import { selectOrders } from './operations';

const initialState = {
  paymentInfo: {},
  amount: 0,
  selectedOrders: [],
  isLoading: {
    orders: false,
    payment: false,
  },
  error: undefined,
};

const customerOrdersSlice = createSlice({
  name: 'customerOrders',
  initialState,
  reducers: {
    selectOrders,
  },
  extraReducers: (builder) => {
    builder
      .addCase(payOrders.pending, (state) => {
        state.error = undefined;
        state.isLoading.payment = true;
      })
      .addCase(payOrders.fulfilled, (state, action) => {
        // state.isLoading.payment = false;
        state.paymentInfo = action.payload;
      })
      .addCase(payOrders.rejected, (state, action) => {
        // state.isLoading.payment = false;
        state.error = action.payload;
      });
  },
});

export const { reducer: customerOrdersReducer } = customerOrdersSlice;
export const { actions: customerOrdersActions } = customerOrdersSlice;
