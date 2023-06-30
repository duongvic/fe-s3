import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';

export const defaultState = {
  data: null,
  account: null,
  accountInfo: null,
  loading: false,
  error: null,
  signup: null,
  qrCode: null,
  notice: null,
  countdown: null,
};

export const initialState: any = { ...defaultState };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setSignup(state, action: PayloadAction<any>) {
      state.signup = action.payload;
    },
    setAccount(state, action: PayloadAction<any>) {
      state.account = action.payload;
    },
    verifyOtp(state) {
      state.loading = true;
      state.error = null;
    },
    loadAccount(state) {
      state.loading = true;
      state.error = null;
      state.account = null;
    },
    accountLoaded(state, action: PayloadAction<any>) {
      state.account = action.payload;
      state.loading = false;
      state.data = null;
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
    },
    setShowFormOTP(state, action: PayloadAction<any>) {
      state.showFormOTP = action.payload;
      state.loading = false;
    },

    setNotice(state, action: PayloadAction<any>) {
      state.notice = action.payload;
      state.loading = false;
    },
    loadSignup(state) {
      state.loading = true;
      state.error = null;
      state.signup = null;
    },
    forgotPassword(state) {
      state.loading = true;
    },
    resetPassword(state) {
      state.loading = true;
    },
    signupLoaded(state, action: PayloadAction<any>) {
      state.signup = action.payload;
      state.loading = false;
      state.data = null;
    },
    getQRCode(state) {
      state.loading = true;
    },
    forgotQRCode(state) {
      state.loading = true;
    },
    setQRCode(state, action: PayloadAction<any>) {
      state.qrCode = action.payload;
    },
    qrCodeLoaded(state, action: PayloadAction<any>) {
      state.qrCode = action.payload;
      state.loading = false;
      state.data = null;
    },
    disableTwoFactor(state) {
      state.loading = true;
    },
    passwordReseted(state) {
      state.data = defaultState.data;
    },
    setCountdown(state, action: PayloadAction<any>) {
      state.countdown = action.payload;
    },
    checkSignin() { },
    logout() { },
    queryAccount() { },
    accountQueried(state, action: PayloadAction<any>) {
      state.accountInfo = action.payload;
      state.data = null;
    },
    refreshToken() { },
  },
});

export const { actions, reducer, name: sliceKey } = authSlice;
