import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.cms || initialState;

export const selectNavbars = createSelector(
  [selectDomain],
  state => state.navbars,
);
export const selectMetas = createSelector([selectDomain], state => state.metas);
export const selectBanners = createSelector(
  [selectDomain],
  state => state.banners,
);
export const selectContacts = createSelector(
  [selectDomain],
  state => state.contacts,
);
export const selectCustomers = createSelector(
  [selectDomain],
  state => state.customers,
);
export const selectDesServices = createSelector(
  [selectDomain],
  state => state.desServices,
);
export const selectBenefitServices = createSelector(
  [selectDomain],
  state => state.benefitServices,
);
export const selectFeatures = createSelector(
  [selectDomain],
  state => state.features,
);
