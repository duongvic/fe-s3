import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { MODE_CREATE } from './constants';
export const defaultState: any = {
  user: null,
  data: null,
  users: [],
  loading: false,
  error: null,
  query: null,
  role: null,
  notice: null,
  mode: MODE_CREATE,
  pagination: { current: 1, pageSize: 10, total: 1 },
  // params: null,
};
export const initialState: any = {
  ...defaultState,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    setMode(state, action: PayloadAction<any>) {
      state.mode = action.payload;
    },
    setQuery(state, action: PayloadAction<any>) {
      state.query = action.payload;
    },
    createUser(state) {
      state.loading = { create: true };
      state.user = null;
    },
    userCreated(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.loading = false;
      state.data = null;
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
    },
    loadUsers(state) {
      state.loading = { gets: true };
      state.error = null;
    },
    usersLoaded(state, action: PayloadAction<any>) {
      state.users = action.payload;
      state.loading = false;
    },
    queryUser(state) {
      state.loading = { query: true };
      state.user = null;
    },
    userQueried(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.loading = false;
      state.query = null;
    },
    updateUser(state) {
      state.loading = { update: true };
    },
    loadUser(state) {
      state.loading = { get: true };
      state.user = null;
    },
    setNotice(state, action: PayloadAction<any>) {
      state.notice = action.payload;
      state.loading = false;
    },
    userLoaded(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.loading = false;
      state.data = null;
    },
    setPagination(state, action: PayloadAction<any>) {
      state.pagination = action.payload;
    },
    queryUsers(state) {
      state.loading = { gets: true };
    },
    usersQueried(state, action: PayloadAction<any>) {
      state.users = action.payload;
      state.loading = false;
    },
    setParams(state, action: PayloadAction<any>) {
      state.params = action.payload;
    },
    queryUserInTable(state) {
      state.loading = { gets: true };
    },
  },
});

export const { actions, reducer, name: sliceKey } = usersSlice;
