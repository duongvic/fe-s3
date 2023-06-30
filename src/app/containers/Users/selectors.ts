import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.users || initialState;

export const selectData = createSelector([selectDomain], state => state.data);

export const selectLoading = createSelector(
  [selectDomain],
  state => state.loading,
);

export const selectError = createSelector([selectDomain], state => state.error);

export const selectUser = createSelector([selectDomain], state => state.user);

export const selectUsers = createSelector([selectDomain], state => state.users);

export const selectQuery = createSelector([selectDomain], state => state.query);

export const selectMode = createSelector([selectDomain], state => state.mode);
export const selectPagination = createSelector(
  [selectDomain],
  state => state.pagination,
);

export const selectNotice = createSelector(
  [selectDomain],
  state => state.notice,
);
export const selectParams = createSelector(
  [selectDomain],
  state => state.params,
);
