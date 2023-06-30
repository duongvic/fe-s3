import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';

export const defaultState: any = {
  loading: false,
  pagination: { current: 1, pageSize: 10, total: 1 },
  products: null,
  notice: null,
  error: null,
  product: null,
};

export const initialState: any = { ...defaultState };

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setProducts(state, action: PayloadAction<any>) {
      state.products = action.payload;
    },
    setProduct(state, action: PayloadAction<any>) {
      state.product = action.payload;
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
      state.data = null;
    },
    setNotice(state, action: PayloadAction<any>) {
      state.notice = action.payload;
      state.loading = false;
      state.data = null;
    },
    loadProducts(state) {
      state.loading = { get: true };
    },
    productsLoaded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.products = action.payload;
      state.data = null;
    },
    loadProduct(state) {
      state.loading = { get: true };
    },
    productLoaded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.product = action.payload;
      state.data = null;
    },
    setPagination(state, action: PayloadAction<any>) {
      state.pagination = action.payload;
    },
    createProduct(state) {
      state.loading = true;
    },
    deleteProduct() { },
    queryProducts(state) {
      state.loading = { get: true };
      state.products = [];
    },
    productsQueried(state, action: PayloadAction<any>) {
      state.loading = false;
      state.products = action.payload;
      state.data = null;
    },
    setParams(state, action: PayloadAction<any>) {
      state.params = action.payload;
    },
    updateProduct(state) {
      state.loading = true;
    },

    loadUnits(state) {
      state.loading = { units: true };
      state.units = [];
    },
    unitsLoaded(state, action: PayloadAction<any>) {
      state.loading = { units: false };
      state.units = action.payload;
      state.data = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = productsSlice;
