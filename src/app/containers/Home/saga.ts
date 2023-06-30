import path, { cms_path } from 'path/api';
import { call, put, takeLatest } from 'redux-saga/effects';
import { requestUnauth } from 'utils/request';
import { actions } from './slice';

export function* getNavbars() {
  const requestURL = path.cms.navbars;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    yield put(actions.navbarsLoaded(`${cms_path}${res[0]?.logo.url}`));
  }
}

export function* getBanners() {
  const requestURL = path.cms.banners;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    let banners: any = [];
    res[0]?.images.forEach(element => {
      banners.push(`${cms_path}${element.url}`);
    });
    yield put(actions.bannersLoaded(banners));
  }
}

export function* getContacts() {
  const requestURL = path.cms.contacts;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    yield put(actions.contactsLoaded(res[0]));
  }
}

export function* getMetas() {
  const requestURL = path.cms.metas;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    delete res[0]?.id;
    delete res[0]?.published_at;
    delete res[0]?.created_at;
    delete res[0]?.updated_at;
    yield put(actions.metasLoaded(res[0]));
  }
}
export function* getDesServices() {
  const requestURL = path.cms.des_services;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    yield put(
      actions.desServicesLoaded({
        vi: {
          title: res[0]?.title,
          sub_title: res[0]?.sub_title,
          body: res[0]?.body,
          image: `${cms_path}${res[0]?.image.url}`,
        },
        en: {
          title: res[1]?.title,
          sub_title: res[1]?.sub_title,
          body: res[1]?.body,
          image: `${cms_path}${res[1]?.image.url}`,
        },
      }),
    );
  }
}
export function* getCustomers() {
  const requestURL = path.cms.customers;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    let customers: any = [];
    res.forEach(element => {
      customers.push(`${cms_path}${element?.logo.url}`);
    });
    yield put(actions.customersLoaded(customers));
  }
}
export function* getBenefitServices() {
  const requestURL = path.cms.benefit_services;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    let benefit: any = { vi: [], en: [] };
    res.forEach((element, index) => {
      if (index <= res.length / 2 - 1) {
        benefit.vi.push({
          title: element?.title,
          image: `${cms_path}${element?.image.url}`,
        });
      } else {
        benefit.en.push({
          title: element?.title,
          image: `${cms_path}${element?.image.url}`,
        });
      }
    });
    yield put(actions.benefitServicesLoaded(benefit));
  }
}
export function* getFeatures() {
  const requestURL = path.cms.features;
  const options = { method: 'get' };

  const res = yield call(requestUnauth, requestURL, options);
  if (res) {
    let features: any = { vi: [], en: [] };
    res.forEach((element, index) => {
      if (index <= res.length / 2 - 1) {
        features.vi.push({ title: element?.title, body: element?.body });
      } else {
        features.en.push({ title: element?.title, body: element?.body });
      }
    });
    yield put(actions.featuresLoaded(features));
  }
}

export function* cmsSaga() {
  yield takeLatest(actions.getNavbars.type, getNavbars);
  yield takeLatest(actions.getBanners.type, getBanners);
  yield takeLatest(actions.getMetas.type, getMetas);
  yield takeLatest(actions.getContacts.type, getContacts);
  yield takeLatest(actions.getFeatures.type, getFeatures);
  yield takeLatest(actions.getBenefitServices.type, getBenefitServices);
  yield takeLatest(actions.getCustomers.type, getCustomers);
  yield takeLatest(actions.getDesServices.type, getDesServices);
}
