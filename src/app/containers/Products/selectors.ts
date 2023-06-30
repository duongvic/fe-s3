import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.products || initialState;

export const selectData = createSelector([selectDomain], state => state.data);
export const selectProducts = createSelector(
  [selectDomain],
  state => state.products,
);
export const selectLoading = createSelector(
  [selectDomain],
  state => state.loading,
);
export const selectNotice = createSelector(
  [selectDomain],
  state => state.notice,
);
export const selectError = createSelector([selectDomain], state => state.error);
export const selectPagination = createSelector(
  [selectDomain],
  state => state.pagination,
);
export const selectProduct = createSelector(
  [selectDomain],
  state => state.product,
);
export const selectParams = createSelector(
  [selectDomain],
  state => state.params,
);

export const selectUnits = createSelector(
  [selectDomain],
  state => state.units,
);
