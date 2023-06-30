import path from 'path/api';
import i18next from 'i18next';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import { selectData, selectPagination } from './selector';
import { actions } from './slice';

export function* getSecurityGroups() {
  const data = yield select(selectData);
  const pagination = yield select(selectPagination);
  const requestURL = path.computes.secgroups.replace(':computeId', data);
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.securityGroupsLoaded(res.data));
    yield put(
      actions.setPagination({
        ...pagination,
        total:
          res.next_page &&
          pagination.total < res.next_page * pagination.pageSize
            ? res.next_page * pagination.pageSize
            : pagination.total,
      }),
    );
  }
}

export function* createSecurityGroupRule() {
  const data: any = yield select(selectData);
  const requestURL = path.computes.rules.replace(':computeId', data.computeId);
  const options = { method: 'post', body: JSON.stringify(data.data) };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield delay(5000);
    // yield put(actions.securityRuleCreated(res));
    yield put(
      actions.setNotice(i18next.t('Message.CREATE_SECURITY_RULE_SUCCESS')),
    );
  }
}

export function* deleteSecurityGroupRule() {
  const data: any = yield select(selectData);
  const requestURL = path.computes.rule
    .replace(':computeId', data.computeId)
    .replace(':ruleId', data.ruleId);
  const options = { method: 'delete' };

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(
      actions.setNotice(i18next.t('Message.DELETE_SECURITY_RULE_FAIL')),
    );
  } else if (typeof res === 'boolean') {
    yield put(
      actions.setNotice(i18next.t('Message.DELETE_SECURITY_RULE_SUCCESS')),
    );
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* securityGroupsSaga() {
  yield takeLatest(actions.loadSecurityGroups.type, getSecurityGroups);
  yield takeLatest(
    actions.createSecurityGroupRule.type,
    createSecurityGroupRule,
  );
  yield takeLatest(
    actions.deleteSecurityGroupRule.type,
    deleteSecurityGroupRule,
  );
}
