import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';

export const initialState: any = {
  navbars: null,
  banners: null,
  metas: null,
  contacts: null,
  features : null,
  customers : null,
  desServices : null,
  benefitServices : null,
};

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    getNavbars() {},
    navbarsLoaded(state, action: PayloadAction<any>) {
      state.navbars = action.payload;
    },
    getBanners() {},
    bannersLoaded(state, action: PayloadAction<any>) {
      state.banners = action.payload;
    },
    getContacts() {},
    contactsLoaded(state, action: PayloadAction<any>) {
      state.contacts = action.payload;
    },
    getMetas() {},
    metasLoaded(state, action: PayloadAction<any>) {
      state.metas = action.payload;
    },
    getDesServices() {},
    desServicesLoaded(state, action: PayloadAction<any>) {
      state.desServices = action.payload;
    },
    getCustomers() {},
    customersLoaded(state, action: PayloadAction<any>) {
      state.customers = action.payload;
    },
    getBenefitServices() {},
    benefitServicesLoaded(state, action: PayloadAction<any>) {
      state.benefitServices = action.payload;
    },
    getFeatures() {},
    featuresLoaded(state, action: PayloadAction<any>) {
      state.features = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = cmsSlice;
