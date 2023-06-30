import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { MODE_CREATE } from '../Users/constants';

export const defaultState: any = {
  data: null,
  orders: [],
  order: null,
  params: null,
  orderIdx: null,
  contract: { current: null },
  loading: false,
  error: null,
  instance: null,
  service: null,
  os: [],
  currentOs: '',
  products: [],
  region: 1,
  regions: [],
  contractCode: null,
  review: [],
  mode: MODE_CREATE,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 1,
  },
  notice: null,
  packages: [],
  productsLanding: [],
  vmsByUserId: null
};

export const initialState: any = {
  ...defaultState,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setParams(state, action: PayloadAction<any>) {
      state.params = action.payload;
    },
    setOrderIdx(state, action: PayloadAction<any>) {
      state.orderIdx = action.payload;
    },
    setNotice(state, action: PayloadAction<any>) {
      state.notice = action.payload;
    },
    setProducts(state, action: PayloadAction<any>) {
      state.products = action.payload;
    },
    setCurrentOs(state, action: PayloadAction<any>) {
      state.currentOs = action.payload;
    },

    setCurrentOsAmount(state, action: PayloadAction<any>) {
      state.currentOsAmount = action.payload;
    },
    setReview(state, action: PayloadAction<any>) {
      state.review = action.payload;
    },

    setContract(state, action: PayloadAction<any>) {
      state.contract = action.payload;
    },

    setInstance(state, action: PayloadAction<any>) {
      state.instance = action.payload;
    },
    setService(state, action: PayloadAction<any>) {
      state.service = action.payload;
    },
    setMode(state, action: PayloadAction<any>) {
      state.mode = action.payload;
    },
    setContractCode(state, action: PayloadAction<any>) {
      state.contractCode = action.payload;
    },
    setRegion(state, action: PayloadAction<any>) {
      state.region = action.payload;
    },
    setOrders(state, action: PayloadAction<any>) {
      state.orders = action.payload;
    },
    loadOrders(state) {
      state.loading = { orders: true };
      state.error = null;
      state.orders = [];
    },
    getRegions(state) {
      state.loading = { regions: true };
      state.error = null;
      state.regions = [];
    },
    regionsGetted(state, action: PayloadAction<any>) {
      state.regions = action.payload;
      state.loading = false;
    },
    ordersLoaded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.orders = action.payload;
      state.data = defaultState.data;
    },
    createOrder(state) {
      state.loading = { order: true };
      state.error = null;
      state.order = null;
    },
    extendOrder(state) {
      state.loading = { order: true };
      state.error = null;
    },
    renewOrder(state) {
      state.loading = { order: true };
      state.error = null;
    },
    orderCreated(state, action: PayloadAction<any>) {
      state.order = action.payload;
      state.loading = false;
      state.data = defaultState.data;
      state.contract = defaultState.contract;
      state.instance = null;
      state.service = null;
      state.review = [];
      state.products = defaultState.products;
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
      state.loadingQuery = false;
      state.data = defaultState.data;
    },
    loadContract(state) {
      state.loadingQuery = true;
      state.error = null;
    },
    contractLoaded(state, action: PayloadAction<any>) {
      state.contract = action.payload;
      state.loadingQuery = false;
    },
    loadInstance(state) {
      state.loading = { instance: true };
      state.error = null;
      state.instance = null;
    },
    instanceLoaded(state, action: PayloadAction<any>) {
      state.instance = action.payload;
      state.loading = false;
    },
    loadService(state) {
      state.loading = { service: true };
      state.error = null;
      state.service = null;
    },
    serviceLoaded(state, action: PayloadAction<any>) {
      state.service = action.payload;
      state.loading = false;
    },
    loadOs(state) {
      state.loading = { os: true };
      state.error = null;
      state.os = [];
    },
    osLoaded(state, action: PayloadAction<any>) {
      state.os = action.payload;
      state.loading = false;
    },
    setPagination(state, action: PayloadAction<any>) {
      state.pagination = action.payload;
    },
    updateOrder(state) {
      state.loading = { order: true };
      state.error = null;
    },
    orderUpdated(state, action: PayloadAction<any>) {
      state.order = action.payload;
      state.data = defaultState.data;
      state.loading = false;
    },
    getOrder(state) {
      state.loading = { order: true };
      state.order = null;
      state.error = null;
    },
    orderGetted(state, action: PayloadAction<any>) {
      state.order = action.payload;
      state.loading = false;
      state.data = defaultState.data;
    },
    deployOrder(state) {
      state.error = null;
    },
    orderDeployed(state) {
      state.data = defaultState.data;
    },
    approveOrder(state) {
      state.error = null;
    },
    orderApproved(state, action: PayloadAction<any>) {
      state.order = action.payload;
      state.data = defaultState.data;
    },
    loadPackages(state) {
      state.loading = true;
    },
    packagesLoaded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.packages = action.payload;
    },
    loadProductsLanding(state) {
      state.loading = true;
    },
    productsLandingLoaded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.productsLanding = action.payload;
    },
    queryOrders(state) {
      state.loading = { orders: true };
      state.orders = [];
    },
    ordersQueried(state, action: PayloadAction<any>) {
      state.orders = action.payload;
      state.data = null;
      state.loading = false;
    },
    loadZones() { },
    zonesLoaded(state, action: PayloadAction<any>) {
      state.zones = action.payload;
    },
    getVmCfg() { },
    vmCfgGetted(state, action: PayloadAction<any>) {
      state.vmCfg = action.payload;
      state.data = defaultState.data;
    },
    deleteOrder() { },

    liquidation(state) {
      state.loading = { order: true };
      state.error = null;
    },

    //VmConfig
    loadVmsByUserId() {

    },

    setVmsByUserIdLoaded(state, action: PayloadAction<any>) {
      state.vmsByUserId = action.payload;
    },

    deleteVmConfig() { },
    
    setVmConfig(state, action: PayloadAction<any>) {
      state.vmCfg = action.payload;
    },
    setVmConfigId(state, action: PayloadAction<any>) {
      state.vmCfgId = action.payload;
    },

    loadVmCfgInstance(state) {
      state.loading = { vmCfgInstance: true };
      state.error = null;
      state.vmCfgInstance = null;
    },
    vmCfgInstanceLoaded(state, action: PayloadAction<any>) {
      state.vmCfgInstance = action.payload;
      state.loading = false;
    },

    setVmCfgInstance(state, action: PayloadAction<any>) {
      state.vmCfgInstance = action.payload;
    },

    loadVmCfgOs(state) {
      state.loading = { vmCfgOs: true };
      state.error = null;
      state.vmCfgOs = null;
    },
    vmCfgOsLoaded(state, action: PayloadAction<any>) {
      state.vmCfgOs = action.payload;
      state.loading = false;
    },

    setVmCfgOs(state, action: PayloadAction<any>) {
      state.vmCfgOs = action.payload;
    },


    loadVmCfgService(state) {
      state.loading = { vmCfgService: true };
      state.error = null;
      state.vmCfgService = null;
    },
    vmCfgServiceLoaded(state, action: PayloadAction<any>) {
      state.vmCfgService = action.payload;
      state.loading = false;
    },

    setVmCfgService(state, action: PayloadAction<any>) {
      state.vmCfgService = action.payload;
    },

    updateOrderVmCfg(state) {
      state.loading = { vmCfg: true };
      state.error = null;
    },

    orderVmCfgUpdated(state, action: PayloadAction<any>) {
      state.vmCfg = action.payload;
      state.data = defaultState.data;
      state.loading = false;
    },

    setRootVolumes(state, action: PayloadAction<any>) {
      state.rootVolumes = action.payload;
    },

    setDataVolumes(state, action: PayloadAction<any>) {
      state.dataVolumes = action.payload;
    },

    setItemsVmConfig(state, action: PayloadAction<any>) {
      state.itemsVmConfig = action.payload;
    },

    setShowBtnCreateContract(state, action: PayloadAction<any>) {
      state.showBtnCreateContract = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = ordersSlice;
