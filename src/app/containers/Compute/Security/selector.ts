import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.security || initialState;

export const selectData = createSelector([selectDomain], state => state.data);

export const selectLoading = createSelector(
  [selectDomain],
  state => state.loading,
);

export const selectError = createSelector([selectDomain], state => state.error);
export const selectNotice = createSelector(
  [selectDomain],
  state => state.notice,
);
export const selectSecurityGroups = createSelector(
  [selectDomain],
  state => state.securityGroups,
);

export const selectSecurityRule = createSelector(
  [selectDomain],
  state => state.securityRule,
);
export const selectPagination = createSelector(
  [selectDomain],
  state => state.pagination,
);
