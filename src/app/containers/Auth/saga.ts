import { Roles, isAllowed, RolesApprove } from './../Users/constants';
import { delay } from 'redux-saga/effects';
// import { message } from 'antd';
import path from 'path/api';
import i18next from 'i18next';
import empty from 'is-empty';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { request, requestBasicAuthorization, requestBasicAuthorizationAndToken } from 'utils/request';
import { selectAccount, selectData } from './selectors';
import { actions } from './slice';
import moment from 'moment';

let idAccount: any = 0
let userName, password, authToken: any
let objAccoutLocal: any = {}

export function* signin() {
  const data = yield select(selectData);
  if (empty(data)) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const requestUrl = path.auth.login;

  let endCodeData_userPassw = endCodeUserPw(data);

  const options = { method: 'get', endCodeData_userPassw };

  try {
    const res = yield call(request, requestUrl, options);
    if (res?.error) {
      return yield put(actions.setError(res?.error?.message));
    }

    if (!Roles.includes(res?.role?.toUpperCase())) {
      return yield put(actions.setError(i18next.t('Message.USER_UNAUTHORIZED')));
    }

    const permission = isAllowed(res?.role?.toUpperCase());

    // yield call([localStorage, 'setItem'], 'account', JSON.stringify(res));
    if (res?.enable_two_factors === true && !data?.otp_token) {
      idAccount = parseInt(res?.id);
      // authToken = res?.auth_token;
      // userName = data?.user_name;
      // password = data?.password
      objAccoutLocal = { ...res, permission: permission }
      yield put(actions.setShowFormOTP(true));

    } else {
      if (res?.enable_two_factors !== true && !data?.otp_token) {
        yield put(actions.setNotice(i18next.t('Message.RECOMMEND_TWO_FACTORS')));
      }
      yield put(actions.accountLoaded(objAccoutLocal));
      yield call([localStorage, 'setItem'], 'account', JSON.stringify(objAccoutLocal));
    }

  } catch (e) {
    return yield put(actions.setError('User password invalid'));
  }
}

export function* signup() {
  const data = yield select(selectData);
  if (empty(data)) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const requestUrl = data.user_role ? path.users.users : path.users.register;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(
      actions.setNotice(
        `Đăng kí thành công, Vui lòng đăng nhập vào Email ${data?.email} để kích hoạt tài khoản`,
      ),
    );
    yield put(actions.signupLoaded(res));
  }
}
export function* forgotPassword() {
  const data = yield select(selectData);
  const requestUrl = path.auth.forgot_password;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestUrl, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DISABLE_TWO_FACTOR_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.setCountdown(Date.now() + 60 * 1000));
    yield put(actions.setNotice(i18next.t('Message.FORGOT_PASSWORD_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}
export function* resetPassword() {
  const data = yield select(selectData);
  const requestUrl = path.auth.reset_password;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestUrl, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.RESET_PASSWORD_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.passwordReseted());
    yield put(actions.setNotice(i18next.t('Message.RESET_PASSWORD_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* checkSignin() {
  let currentAccount = yield call([localStorage, 'getItem'], 'account');
  if (currentAccount) currentAccount = JSON.parse(currentAccount);

  const account = yield select(selectAccount);
  if (!account) yield put(actions.setAccount(currentAccount));
}

export function* logout() {
  let setting = yield call([localStorage, 'getItem'], 'setting');
  console.log(setting)
  if (setting) {
    setting = JSON.parse(setting);
    if (setting.hasOwnProperty('qrCode')) {
      delete setting.qrCode;
      yield call([localStorage, 'setItem'], 'setting', JSON.stringify(setting));
    }
  }

  yield call([localStorage, 'removeItem'], 'account');
  window.location.reload();
}

export function* getQRCode() {
  const requestUrl = path.users.create_two_factors;
  const options = { method: 'post' };

  let setting = yield call([localStorage, 'getItem'], 'setting');
  if (setting) setting = JSON.parse(setting);

  const res = yield call(request, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    setting = { ...setting, qrCode: res.format_otp_token };
    yield put(
      actions.setNotice(i18next.t('Message.CREATE_TWO_FACTORS_SUCCESS')),
    );
    yield call([localStorage, 'setItem'], 'setting', JSON.stringify(setting));
    yield put(actions.qrCodeLoaded(res.format_otp_token));
  }
}
export function* forgotQRCode() {
  const data = yield select(selectData);
  const requestUrl = path.users.forgot_qrcode;
  const options = { method: 'post', body: JSON.stringify(data) };

  const res = yield call(request, requestUrl, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DISABLE_TWO_FACTOR_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice(i18next.t('Message.RESET_QRCODE_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}
export function* disableTwoFactor() {
  const data = yield select(selectData);

  const requestUrl = path.users.disable_two_factors;
  const options = { method: 'delete', body: JSON.stringify(data) };

  const res = yield call(request, requestUrl, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Message.DISABLE_TWO_FACTOR_FAIL')));
  } else if (typeof res === 'boolean') {
    yield put(
      actions.setNotice(i18next.t('Message.DISABLE_TWO_FACTOR_SUCCESS')),
    );
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* queryAccount() {
  const data = yield select(selectData);
  let endCodeData_userPassw = endCodeUserPw(data);

  const accoutStorage = localStorage.getItem('account');
  const userInfoStorage = accoutStorage ? JSON.parse(accoutStorage) : null;


  // const data = yield select(selectData);
  // const requestUrl = `${path.users.user}?user_name=${data.user_name}`;

  const requestUrl = `${path.users.users}/${userInfoStorage?.id}`;

  const options = { method: 'get', endCodeData_userPassw };

  const res = yield call(requestBasicAuthorizationAndToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const profile = { ...res.profile };
    delete profile.id;
    const user = { ...res, ...profile };
    delete user.profile;

    yield put(actions.accountQueried(user));
  }
}

export function* refreshToken() {
  console.log('refreshToken')
  let account = yield call([localStorage, 'getItem'], 'account');

  let currentTime = moment().unix();

  if (account) {
    account = JSON.parse(account);
    account.access_token = account.refresh_token;
    yield call([localStorage, 'setItem'], 'account', JSON.stringify(account));

    // const requestUrl = path.auth.refresh_token;
    // const options = { method: 'put' };

    try {
      // const res = yield call(request, requestUrl, options);
      let expireTime: any = account?.expires_on ? moment(account?.expires_on).unix() : 0;
      if (currentTime > expireTime) {
        yield call([localStorage, 'removeItem'], 'account');
        window.location.reload();
      }
      else {
        let res: any = []
        if (res) {
          account = { ...account, ...res };
          yield call([localStorage, 'setItem'], 'account', JSON.stringify(account));
        }
      }

    } catch {
      yield call([localStorage, 'removeItem'], 'account');
      window.location.reload();
    }
  }
}

export function* verifyOtp() {
  try {
    const data = yield select(selectData);
    if (empty(data)) {
      console.log(i18next.t('Message.DATA_INVALID'));
      return;
    }
    let endCodeData_userPassw = endCodeUserPw(data);
    const requestUrl = `${path.users.verify_otp}/${data?.id ? data?.id : idAccount}`;
    const options = {
      method: 'post',
      body: JSON.stringify({
        action: "verify_otp",
        resource: {
          otp: data?.otp_token
        }
      }),
      endCodeData_userPassw
    };
    const res = yield call(requestBasicAuthorization, requestUrl, options);
    if ("error" in res) {
      return yield put(actions.setError(res?.error?.message));
    }
    yield call([localStorage, 'setItem'], 'account', JSON.stringify(objAccoutLocal));
    const user = localStorage.getItem('account');
    const userInfo = user ? JSON.parse(user) : null;

    yield delay(2000);
    yield put(actions.accountLoaded(userInfo));
  } catch (error) {
    return yield put(actions.setError(error))
  }

}


export function endCodeUserPw(data) {
  if (empty(data)) return null;
  let userNamePassString = `${data?.user_name}:${data?.password}`;
  let buff = new Buffer(userNamePassString);
  return buff.toString('base64');
};

/**
 * Root saga manages watcher lifecycle
 */
export function* authSaga() {
  yield takeLatest(actions.loadAccount.type, signin);
  yield takeLatest(actions.loadSignup.type, signup);
  yield takeLatest(actions.checkSignin.type, checkSignin);
  yield takeLatest(actions.logout.type, logout);
  yield takeLatest(actions.forgotPassword.type, forgotPassword);
  yield takeLatest(actions.getQRCode.type, getQRCode);
  yield takeLatest(actions.forgotQRCode.type, forgotQRCode);
  yield takeLatest(actions.disableTwoFactor.type, disableTwoFactor);
  yield takeLatest(actions.resetPassword.type, resetPassword);
  yield takeLatest(actions.queryAccount.type, queryAccount);
  yield takeLatest(actions.refreshToken.type, refreshToken);
  yield takeLatest(actions.verifyOtp.type, verifyOtp);
}
