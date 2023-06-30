import path from 'path/api';
import i18next from 'i18next';
import empty from 'is-empty';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { requestToken } from 'utils/request';
import { MODE_CREATE, MODE_UPDATE } from './constants';
import {
  selectData,
  selectPagination,
  selectParams,
  selectQuery,
  // selectUsers,
} from './selectors';
import { actions } from './slice';
import moment from 'moment';


export function* queryUser() {
  const query = yield select(selectQuery);
  if (!query) {
    // console.log(i18next.t('Message.DATA_INVALID'));
    yield put(actions.setMode(MODE_CREATE));
    return;
  }
  const requestUrl = Boolean(Number(query))
    ? `${path.users.users}/${query}`
    : `${path.users.users}/?expand=user_profiles,resources&filter[]=userid='${query}'`

  const options = { method: 'get' };
  const res = yield call(requestToken, requestUrl, options);
  if ('error' in res) {
    yield put(actions.setError(res.error.message));
  } else {
    if (res?.resources?.length > 0) {
      const profile = { ...res?.resources?.[0]?.user_profiles?.resources?.[0] };

      // delete profile.id;
      const user = {
        ...res,
        ...profile,
        id: res?.resources?.[0] ? parseInt(res?.resources?.[0]?.id) : '',
        username: res?.resources?.[0] ? res?.resources?.[0]?.userid : '',
        full_name: res?.resources?.[0] ? res?.resources?.[0]?.name : '',
        phone_number: res?.resources?.[0]?.phone_number,
        email: res?.resources?.[0]?.email,

        id_number: profile?.id_number,
        id_issue_date: profile && profile?.id_issue_date ? moment(profile?.id_issue_date).format('YYYY-MM-DD') : undefined,
        birthday: profile?.date_of_birth,
        status: res?.resources?.[0]?.status === true ? 'ACTIVE' : 'DEACTIVATED'
        // id_location: profile?.id_issue_location,
      };
      delete user.profile;
      yield put(actions.userQueried(user));
    } else {
      yield put(actions.setError('User not found'));
    }

  }
}

export function* queryUsers() {
  const query = yield select(selectQuery);
  const requestUrl = `${path.users.users}/?expand=user_profiles,resources&filter[]=userid='${query}'`;
  const options = { method: 'get' };
  const res = yield call(requestToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.usersQueried(res?.resources));
  }
}

export function* getUsers() {
  const pagination = yield select(selectPagination);
  const requestUrl = `${path.users.users}/?expand=user_profiles,resources`;

  const options = { method: 'get' };

  const res = yield call(requestToken, requestUrl, options);

  if ('error' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.usersLoaded(res.resources));
    yield put(
      actions.setPagination({
        ...pagination,
        total: res.count
        // res.next_page &&
        //   pagination.total < res.next_page * pagination.pageSize
        //   ? res.next_page * pagination.pageSize
        //   : pagination.total,
      }),
    );
  }
}

export function* getUser() {
  const query = yield select(selectQuery);
  if (!query) {
    // console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }

  const requestUrl = `${path.users.users}/${query}?expand=user_profiles,resources`;
  const options = { method: 'get' };
  const res = yield call(requestToken, requestUrl, options);
  if ('error' in res) {
    yield put(actions.setError(res?.errors[0]?.message));
  } else {
    const profile = { ...res?.user_profiles?.resources?.[0] };

    // delete profile.id;
    const user = {
      ...res,
      ...profile,
      id: parseInt(res?.id),
      username: res?.userid,
      full_name: res?.name,
      phone_number: res?.phone_number,
      email: res?.email,

      id_number: profile?.id_number,
      id_issue_date: profile && moment(profile?.id_issue_date).format('YYYY-MM-DD'),
      birthday: profile?.date_of_birth,
      status: res?.status === true ? 'ACTIVE' : 'DEACTIVATED'
      // id_location: profile?.id_issue_location,
    };
    delete user.profile;
    yield put(actions.userQueried(user));
  }
}

export function* createUser() {
  const data = yield select(selectData);
  if (empty(data)) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const body = {
    userid: data?.username,
    password: data?.password,
    name: data?.user_type === 'COMPANY' ? data?.company : data?.full_name,
    email: data?.email,
    phone_number: data?.phone_number,
    profile: {
      user_type: data?.user_type,
      account_type: data?.account_type,
      company: data?.company,
      address: data?.address,
      tax_number: data?.tax_number,
      date_of_birth: data?.date_of_birth ? new Date(data?.date_of_birth).toISOString : undefined,
      id_number: data?.id_number,
      id_issue_date: data?.id_issue_date,
      id_issue_location: data?.id_issue_location,

      rep_name: data?.rep_name,
      rep_phone: data?.rep_phone,
      rep_email: data?.rep_email,

      ref_name: data?.ref_name,
      ref_phone: data?.ref_phone,
      ref_email: data?.ref_email,
    }
  };


  const requestUrl = path.users.users;
  const options = { method: 'post', body: JSON.stringify(body) };
  const res = yield call(requestToken, requestUrl, options);
  if ('error' in res) {
    yield put(actions.setError(res.error.message));
  } else {
    const userInfo = res?.results?.[0]?.user;
    const profile = res?.results?.[0]?.user_profile;

    // delete user_profile.id;
    const user = {
      ...userInfo,
      ...profile,
      id: parseInt(userInfo?.id),
      username: userInfo?.userid,
      full_name: userInfo?.name,
      phone_number: userInfo?.phone_number,
      email: userInfo?.email,

      id_number: profile?.id_number,
      id_issue_date: profile && moment(profile?.id_issue_date).format('YYYY-MM-DD'),
      date_of_birth: profile && moment(profile?.id_issue_date).format('YYYY-MM-DD'),
      password: data?.password,
    };

    // yield delay(500);
    // yield put(actions.setUser(user));
    yield put(actions.userCreated(user));
    yield put(actions.setMode(MODE_UPDATE));
    yield put(actions.setNotice(i18next.t('Message.CREATE_USER_SUCCESS')));
  }
}



export function* updateUser() {
  // const users = yield select(selectUsers);
  const data = yield select(selectData);

  if (!data) {
    console.log(i18next.t('Message.DATA_INVALID'));
    return;
  }
  const requestUrl = `${path.users.users}/${data.userId}`;

  const body = {
    action: 'edit',
    resource: {
      name: data?.data?.full_name,
      email: data?.data?.email,
      phone_number: data?.data?.phone_number,
      profile: {
        user_type: data?.data?.user_type,
        account_type: data?.data?.account_type,
        company: data?.data?.company,
        address: data?.data?.address,
        tax_number: data?.data?.tax_number,
        date_of_birth: data?.data?.date_of_birth ? new Date(data?.data?.date_of_birth).toISOString() : undefined,
        id_number: data?.data?.id_number,
        id_issue_date: data?.data?.id_issue_date,
        id_issue_location: data?.data?.id_issue_location,

        rep_name: data?.data?.rep_name,
        rep_phone: data?.data?.rep_phone,
        rep_email: data?.data?.rep_email,

        ref_name: data?.data?.ref_name,
        ref_phone: data?.data?.ref_phone,
        ref_email: data?.data?.ref_email,
      }
    }

  };

  const options = { method: 'post', body: JSON.stringify(body) };
  const res = yield call(requestToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {

    const profile = res?.user_profile;
    // delete profile.id;
    const userInfo = res?.user;
    // const user = { ...profile, ...userInfo };

    const user = {
      ...userInfo,
      ...profile,
      id: parseInt(userInfo?.id),
      username: userInfo?.userid,
      full_name: userInfo?.name,
      phone_number: userInfo?.phone_number,
      email: userInfo?.email,

      id_number: profile?.id_number,
      id_issue_date: profile && moment(profile?.id_issue_date).format('YYYY-MM-DD'),
      date_of_birth: profile && moment(profile?.date_of_birth).format('YYYY-MM-DD'),
    };


    // delete user.profile;
    yield put(actions.setNotice(i18next.t('Message.UPDATE_USER_SUCCESS')));
    yield put(actions.userLoaded(user));

    // if (users.length > 1) {
    //   const newUsers = [...users];
    //   newUsers[data.index] = user;
    //   yield put(actions.usersLoaded(newUsers));
    // }
  }
}

export function* queryUserInTable() {
  const pagination = yield select(selectPagination);
  const params = yield select(selectParams);

  const requestUrl = `${path.users.users}/?expand=user_profiles,resources&filter[]=userid='${params.userid}'`;
  const options = { method: 'get' };

  const res = yield call(requestToken, requestUrl, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.usersQueried(res?.resources));
    yield put(
      actions.setPagination({
        ...pagination,
        total: res.subcount
        // res.next_page &&
        //   pagination.total < res.next_page * pagination.pageSize
        //   ? res.next_page * pagination.pageSize
        //   : pagination.total,
      }),
    );
  }
}
/**
 * Root saga manages watcher lifecycle
 */

export function* usersSaga() {
  yield takeLatest(actions.createUser.type, createUser);
  yield takeLatest(actions.queryUser.type, queryUser);
  yield takeLatest(actions.queryUsers.type, queryUsers);
  yield takeLatest(actions.loadUsers.type, getUsers);
  yield takeLatest(actions.updateUser.type, updateUser);
  yield takeLatest(actions.loadUser.type, getUser);
  yield takeLatest(actions.queryUserInTable.type, queryUserInTable);
}
