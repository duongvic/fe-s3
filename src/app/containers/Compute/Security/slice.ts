import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';

export const initialState: any = {
  data: null,
  securityGroups: [],
  securityRule: null,
  loading: {
    overview: false,
    create: false,
    delete: false,
  },
  error: null,
  notice: null,
  pagination: { current: 1, pageSize: 10, total: 1 },
};
const securityGroupsSlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setSecurityRule(state, action: PayloadAction<any>) {
      state.securityRule = action.payload;
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = {};
    },
    setNotice(state, action: PayloadAction<any>) {
      state.notice = action.payload;
      state.loading = {};
    },
    securityGroupsLoaded(state, action: PayloadAction<any>) {
      state.data = null;
      state.loading.overview = false;
      state.securityGroups = action.payload;
    },
    createSecurityGroupRule(state) {
      state.error = null;
      state.notice = null;
      state.loading.create = true;
      state.securityRule = null;
    },
    securityRuleCreated(state, action: PayloadAction<any>) {
      state.data = null;
      state.loading.create = false;
      state.securityRule = action.payload;
    },
    deleteSecurityGroupRule(state) {
      state.error = null;
      state.notice = null;
      state.loading.delete = true;
    },
    loadSecurityGroups(state) {
      state.error = null;
      state.notice = null;
      state.securityGroups = [];
      state.loading.overview = true;
    },
    setSecurityGroups(state, action: PayloadAction<any>) {
      state.securityGroups = action.payload;
    },
    setPagination(state, action: PayloadAction<any>) {
      state.pagination = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = securityGroupsSlice;
