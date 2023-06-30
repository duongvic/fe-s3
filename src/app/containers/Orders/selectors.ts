import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.orders || initialState;

export const selectData = createSelector([selectDomain], state => state.data);

export const selectLoading = createSelector(
  [selectDomain],
  state => state.loading,
);

export const selectLoadingQuery = createSelector(
  [selectDomain],
  state => state.loadingQuery,
);

export const selectError = createSelector([selectDomain], state => state.error);

export const selectRegions = createSelector(
  [selectDomain],
  state => state.regions,
);

export const selectOrderIdx = createSelector(
  [selectDomain],
  state => state.orderIdx,
);

export const selectNotice = createSelector(
  [selectDomain],
  state => state.notice,
);

export const selectRegion = createSelector(
  [selectDomain],
  state => state.region,
);

export const selectOrders = createSelector(
  [selectDomain],
  state => state.orders,
);
export const selectPagination = createSelector(
  [selectDomain],
  state => state.pagination,
);

export const selectOrder = createSelector([selectDomain], state => state.order);

export const selectContractCode = createSelector(
  [selectDomain],
  state => state.contractCode,
);

export const selectContract = createSelector(
  [selectDomain],
  state => state.contract,
);

export const selectMode = createSelector([selectDomain], state => state.mode);

export const selectInstance = createSelector(
  [selectDomain],
  state => state.instance,
);

export const selectService = createSelector(
  [selectDomain],
  state => state.service,
);

export const selectReview = createSelector(
  [selectDomain],
  state => state.review,
);

export const selectReviewPool = createSelector(
  [selectDomain],
  state => state.review,
);

export const selectOs = createSelector([selectDomain], state => state.os);

export const selectCurrentOs = createSelector(
  [selectDomain],
  state => state.currentOs,
);

export const selectCurrentOsAmount = createSelector(
  [selectDomain],
  state => state.currentOsAmount,
);

export const selectProducts = createSelector(
  [selectDomain],
  state => state.products,
);
export const selectPackages = createSelector(
  [selectDomain],
  state => state.packages,
);
export const selectProductsLanding = createSelector(
  [selectDomain],
  state => state.productsLanding,
);

export const selectZones = createSelector([selectDomain], state => state.zones);
export const selectConditions = createSelector(
  [selectDomain],
  state => state.conditions,
);

//VmConfig
export const selectVmCfg = createSelector([selectDomain], state => state.vmCfg);

export const selectVmCfgId = createSelector(
  [selectDomain],
  state => state.vmCfgId,
);

export const selectVmCfgInstance = createSelector(
  [selectDomain],
  state => state.vmCfgInstance,
);

export const selectVmCfgService = createSelector(
  [selectDomain],
  state => state.vmCfgService,
);

export const selectVmCfgOs = createSelector(
  [selectDomain],
  state => state.vmCfgOs
);

export const selectParams = createSelector(
  [selectDomain],
  state => state.params,
);

export const selectRootVolumes = createSelector(
  [selectDomain],
  state => state.rootVolumes,
);

export const selectDataVolumes = createSelector(
  [selectDomain],
  state => state.dataVolumes,
);


export const selectItemsVmConfig = createSelector(
  [selectDomain],
  state => state.itemsVmConfig,
);

export const selectShowBtnCreateContract = createSelector(
  [selectDomain],
  state => state.showBtnCreateContract,
);

export const selectVmsByUserId = createSelector(
  [selectDomain],
  state => state.vmsByUserId
);