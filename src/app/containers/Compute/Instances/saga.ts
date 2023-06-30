import path from 'path/api';
import i18next from 'i18next';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { setConditions } from 'utils/common';
import { request, requestStatus } from 'utils/request';
import {
  selectBackups,
  selectBackupSchedules,
  selectComputes,
  selectComputesError,
  selectData,
  selectDataGetMonitor,
  selectPagination,
  selectParams,
  selectSnapshots,
  selectSnapshotSchedules,
} from './selector';
import { actions } from './slice';

export function* getComputes() {
  const pagination = yield select(selectPagination);
  const requestURL =
    path.computes.computes +
    `?page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.computesLoaded(res.data));
    yield put(actions.setPagination({ ...pagination, total: res.total }));
  }
}

export function* getComputesFilterRoleUser() {
  const requestURL = `${path.computes.computes}?condition=deleted__eq__0`;
  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.computesLoaded(res.data));
  }
}

export function* getComputesError() {
  const requestURL = path.computes.computesError;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    const { data } = res;
    const newData = data.map(item => ({ ...item, ...item.data }));
    yield put(actions.computesErrorGetted(newData));
  }
}

export function* getFlavor() {
  const requestURL = path.flavor.flavors;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.flavorLoaded(res));
  }
}

export function* getNetworks() {
  const requestURL = path.networks.networks;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.networksLoaded(res));
  }
}

export function* getSubnets() {
  const requestURL = path.networks.networks;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.networksLoaded(res));
  }
}

export function* getSnapshots() {
  const data = yield select(selectData);
  const requestURL = `${path.computes.snapshots.replace(
    ':computeId',
    data.instanceId,
  )}`;
  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.snapshotsGetted(res.data[0]?.snapshots));
  }
}

export function* getBackups() {
  const data = yield select(selectData);

  const requestURL = `${path.computes.backupFiles.replace(
    ':computeId',
    data.instanceId,
  )}`;
  const options = { method: 'get' };

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.backupsGetted(res.data[0]?.backups));
  }
}

export function* performInstance() {
  const data = yield select(selectData);
  const requestURL = `${path.computes.compute.replace(
    ':computeId',
    data.computeId,
  )}/action?action=${data.action}`;
  const options = { method: 'put' };

  const res = yield call(request, requestURL, options);
  if (res === true || res === null) {
    yield put(actions.setNotice(i18next.t('Message.ACTION_COMPLETED')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}


export function* loadCompute() {
  const data = yield select(selectData);
  const requestURL = `${path.computes.compute.replace(
    ':computeId',
    data.instanceId,
  )}`;
  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.computeLoaded(res));
  }
}

export function* deleteCompute() {
  const data = yield select(selectData);
  const computes = yield select(selectComputes);
  const requestURL = `${path.computes.compute.replace(
    ':computeId',
    data.computeId,
  )}`;
  const options = { method: 'delete' };

  // const res = yield call(request, requestURL, options);
  const res = yield call(requestStatus, requestURL, options);
  if (!res) {
    yield put(actions.setError(i18next.t('Field_Message.DELETE_COMPUTE_FAIL')));
  } else if (typeof res === 'boolean') {
    yield delay(5000);
    yield put(
      actions.setNotice(i18next.t('Field_Message.DELETE_COMPUTE_SUCCESS')),
    );
    yield put(actions.setData(null));
    const newComputes = [...computes];
    newComputes.splice(data.index, 1);
    yield put(actions.computesLoaded(newComputes));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* reDeployCompute() {
  const data = yield select(selectData);
  const computesError = yield select(selectComputesError);
  const requestURL = `${path.computes.computes}`;

  const options = {
    method: 'put',
    body: JSON.stringify({
      compute_id: data?.compute_id,
      availability_zone: data?.zone,
    }),
  };

  const res = yield call(request, requestURL, options);

  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    let newComputesError = [...computesError];
    newComputesError.splice(data?.index, 1);
    yield put(actions.computesErrorGetted(newComputesError));
    yield put(actions.setNotice(i18next.t('Message.RE_DEPLOY_SUCCESS')));
  }
}

export function* getConsole() {
  const data = yield select(selectData);
  const requestURL = path.computes.vnc.replace(':computeId', data.instanceId);
  const options = { method: 'get' };
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.consoleLoaded(res));
  }
}

export function* createSnapshot() {
  const data = yield select(selectData);
  const requestURL = path.computes.snapshots.replace(
    ':computeId',
    data.instanceId,
  );
  const options = { method: 'post', body: JSON.stringify(data.data) };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if (typeof res === 'boolean') {
    yield delay(10000);
    yield put(actions.setNotice(i18next.t('Message.CREATE_SNAPSHOT_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* createBackup() {
  const data = yield select(selectData);
  const requestURL = path.computes.backupFiles.replace(
    ':computeId',
    data.instanceId,
  );
  const options = { method: 'post', body: JSON.stringify(data.data) };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);

  if (typeof res === 'boolean') {
    yield delay(10000);
    yield put(actions.backupCreated(res));
    yield put(actions.setNotice(i18next.t('Message.CREATE_BACKUP_SUCCESS')));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* createBackupSchedule() {
  const data = yield select(selectData);
  const requestURL = path.computes.schedules.replace(
    ':computeId',
    data.instanceId,
  );
  const options = { method: 'post', body: JSON.stringify(data.data) };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.backupScheduleCreated(res));
    yield put(actions.setNotice(i18next.t('Message.CREATE_SCHEDULE_SUCCESS')));
  }
}

export function* getBackupSchedules() {
  const data = yield select(selectData);
  const requestURL =
    path.computes.schedules.replace(':computeId', data.instanceId) +
    '?condition=type__eq__BACKUP';
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.backupSchedulesGetted(res.data));
    yield put(actions.setNotice(null));
  }
}

export function* deleteScheduleBackup() {
  const schedules = yield select(selectBackupSchedules);
  const data = yield select(selectData);
  const requestURL =
    path.computes.schedule.replace(':computeId', data.instanceId) +
    `/${data.scheduleId}`;
  const options = { method: 'delete' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError('delete schedule backup fail'));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice('delete schedule backup success'));
    yield put(actions.setData(null));
    const newSchedules = [...schedules];
    newSchedules.splice(data.index, 1);
    yield put(actions.backupSchedulesGetted(newSchedules));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* deleteBackup() {
  const backups = yield select(selectBackups);
  const data = yield select(selectData);
  const requestURL = path.computes.backupFile
    .replace(':computeId', data.instanceId)
    .replace(':backupId', data.backupId);
  const options = { method: 'delete' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError('delete backup fail'));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice('delete backup success'));
    yield put(actions.setData(null));
    const newBackups = [...backups];
    newBackups.splice(data.index, 1);
    yield put(actions.backupsGetted(newBackups));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* rollbackBackup() {
  const data = yield select(selectData);
  const requestURL = path.computes.backupFile
    .replace(':computeId', data.instanceId)
    .replace(':backupId', data.backupId);
  const options = { method: 'post' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield delay(2000);
    yield put(actions.setNotice('rollback backup success'));
    yield put(actions.setData(null));
  }
}

export function* deleteSnapshot() {
  const snapshots = yield select(selectSnapshots);
  const data = yield select(selectData);
  const requestURL =
    path.computes.snapshot.replace(':computeId', data.instanceId) +
    `/${data.snapshotId}`;
  const options = { method: 'delete' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError('delete snapshot fail'));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice('delete snapshot success'));
    yield put(actions.setData(null));
    const newSnapshots = [...snapshots];
    newSnapshots.splice(data.index, 1);
    yield put(actions.snapshotsGetted(newSnapshots));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* rollbackSnapshot() {
  const data = yield select(selectData);
  const requestURL =
    path.computes.snapshot.replace(':computeId', data.instanceId) +
    `/${data.snapshotId}`;
  const options = { method: 'post' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield delay(2000);
    yield put(
      actions.setNotice(i18next.t('Field_Message.ROLLBACK_SNAPSHOT_SUCCESS')),
    );
    yield put(actions.setData(null));
  }
}

export function* deleteScheduleSnapshot() {
  const schedules = yield select(selectSnapshotSchedules);
  const data = yield select(selectData);
  const requestURL =
    path.computes.schedule.replace(':computeId', data.instanceId) +
    `/${data.scheduleId}`;
  const options = { method: 'delete' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if (!res) {
    yield put(actions.setError('delete schedule snapshot fail'));
  } else if (typeof res === 'boolean') {
    yield put(actions.setNotice('delete schedule snapshot success'));
    yield put(actions.setData(null));
    const newSchedules = [...schedules];
    newSchedules.splice(data.index, 1);
    yield put(actions.snapshotSchedulesGetted(newSchedules));
  } else if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  }
}

export function* createSnapshotSchedule() {
  const data = yield select(selectData);
  const requestURL = path.computes.schedules.replace(
    ':computeId',
    data.instanceId,
  );
  const options = { method: 'post', body: JSON.stringify(data.data) };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.snapshotScheduleCreated(res));
    yield put(actions.setNotice(i18next.t('Message.CREATE_SCHEDULE_SUCCESS')));
  }
}

export function* getSnapshotSchedules() {
  const data = yield select(selectData);
  const requestURL =
    path.computes.schedules.replace(':computeId', data.instanceId) +
    '?condition=type__eq__SNAPSHOT';
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.snapshotSchedulesGetted(res.data));
    yield put(actions.setNotice(null));
  }
}

export function* getMonitor() {
  const data = yield select(selectDataGetMonitor);

  const requestCpu = path.computes.monitor
    .replace(':computeId', data.computeId)
    .replace(':step', data.step ? data.step : '1m')
    .replace(':start', data.start)
    .replace(':type', 'vcpu')
    .replace(':end', data.end);
  const requestRam = path.computes.monitor
    .replace(':computeId', data.computeId)
    .replace(':step', data.step ? data.step : '1m')
    .replace(':start', data.start)
    .replace(':type', 'ram')
    .replace(':end', data.end);
  const requestDisk = path.computes.monitor
    .replace(':computeId', data.computeId)
    .replace(':step', data.step ? data.step : '1m')
    .replace(':start', data.start)
    .replace(':type', 'disk')
    .replace(':end', data.end);
  const requestNetwork = path.computes.monitor
    .replace(':computeId', data.computeId)
    .replace(':step', data.step ? data.step : '1m')
    .replace(':start', data.start)
    .replace(':type', 'network')
    .replace(':end', data.end);
  const requestIops = path.computes.monitor
    .replace(':computeId', data.computeId)
    .replace(':step', data.step ? data.step : '1m')
    .replace(':start', data.start)
    .replace(':type', 'iops')
    .replace(':end', data.end);

  const options = { method: 'get' };

  const [cpu, ram, disk, network, iops] = yield all([
    call(request, requestCpu, options),
    call(request, requestRam, options),
    call(request, requestDisk, options),
    call(request, requestNetwork, options),
    call(request, requestIops, options),
  ]);
  if (
    'errors' in cpu ||
    'errors' in ram ||
    'errors' in disk ||
    'errors' in network ||
    'errors' in iops
  ) {
    yield put(actions.setError(i18next.t('Message.GET_MONITOR_FAIL')));
  } else {
    const newMonitor = {
      cpu: cpu[0]?.values,
      ram: ram[0]?.values,
      disk: {
        read: disk.read[0]?.values,
        write: disk.write[0]?.values,
      },
      network: {
        receiver: network.receiver[0]?.values,
        transfer: network.transfer[0]?.values,
      },
      iops: {
        receiver: iops.receiver[0]?.values,
        transfer: iops.transfer[0]?.values,
      },
    };
    yield put(actions.monitorGetted(newMonitor));
  }
}

export function* getMonitorLog() {
  const data = yield select(selectData);
  const pathMonitor = path.computes.monitor
    .replace(':computeId', data.computeId)
    .replace(':step', data.step ? data.step : '1m')
    .replace(':start', data.start)
    .replace(':end', data.end);

  const requestCpu = pathMonitor.replace(':type', 'vcpu');
  const requestRam = pathMonitor.replace(':type', 'ram');
  const requestDisk = pathMonitor.replace(':type', 'disk');
  const requestNetwork = pathMonitor.replace(':type', 'network');
  const requestIops = pathMonitor.replace(':type', 'iops');

  const options = { method: 'get' };

  const [cpu, ram, disk, network, iops] = yield all([
    call(request, requestCpu, options),
    call(request, requestRam, options),
    call(request, requestDisk, options),
    call(request, requestNetwork, options),
    call(request, requestIops, options),
  ]);
  if (
    'errors' in cpu ||
    'errors' in ram ||
    'errors' in disk ||
    'errors' in network ||
    'errors' in iops
  ) {
    yield put(actions.setError(i18next.t('Message.GET_MONITOR_FAIL')));
  } else {
    yield put(
      actions.monitorLogGetted({
        cpu: cpu[0]?.values,
        ram: ram[0]?.values,
        disk: {
          read: disk.read[0]?.values,
          write: disk.write[0]?.values,
        },
        network: {
          receiver: network.receiver[0]?.values,
          transfer: network.transfer[0]?.values,
        },
        iops: {
          receiver: iops.receiver[0]?.values,
          transfer: iops.transfer[0]?.values,
        },
      }),
    );
  }
}

export function* getActionLog() {
  const data = yield select(selectData);
  const requestURL = path.computes.histories.replace(
    ':computeId',
    data?.instanceId,
  );
  const options = { method: 'get' };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.actionLogLoaded([...res.data]));
  }
}

export function* editCompute() {
  const data = yield select(selectData);
  const { instanceId, ...newData } = data;
  const requestURL = path.computes.compute.replace(':computeId', instanceId);
  const options = {
    method: 'put',
    body: JSON.stringify({ ...newData }),
  };

  if (!data) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }
  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.computeLoaded(res));
    yield put(actions.setNotice(i18next.t('Message.UPDATE_INSTANCE_SUCCESS')));
  }
}

export function* queryInstances() {
  const params = yield select(selectParams);
  const condition = setConditions({ ...params });
  const pagination = yield select(selectPagination);
  const requestURL = `${path.computes.computes}?condition=${condition}&page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };

  if (!params) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    yield put(actions.instancesQueried(res.data));
    if (res.data.length === 0) {
      yield put(actions.setError(i18next.t('Message.RETURN_ZERO_DATA')));
    }
    yield put(actions.setPagination({ ...pagination, total: res.total }));
  }
}

export function* queryInstancesByContractCode() {
  const params: any = yield select(selectParams);
  // const condition = setConditions({ ...params });
  const contractCode = setConditions({ contract_code: params?.contract_code });
  const pagination = yield select(selectPagination);

  let requestURL = `${path.orders.orders}?condition=${contractCode}&page=${pagination.current}&page_size=${pagination.pageSize}`;
  const options = { method: 'get' };

  if (!params) {
    yield put(actions.setError(i18next.t('Message.DATA_INVALID')));
    return;
  }

  const res = yield call(request, requestURL, options);
  if ('errors' in res) {
    yield put(actions.setError(res.errors[0].message));
  } else {
    if (!res.data.length) {
      yield put(actions.setError(i18next.t('Message.RETURN_ZERO_DATA')));
    }

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

    const ordersId = res.data.map(item => item.id);
    if (ordersId.length) {
      const instances = yield all(
        ordersId.map(item =>
          call(
            request,
            `${path.computes.computes}?condition=order_id__eq__${item}`,
            options,
          ),
        ),
      );
      if ('errors' in instances) {
        yield put(actions.setError(instances[0].errors[0].message));
      } else {
        let instancesQueried: any = [];
        instances.forEach(item => {
          instancesQueried = [...instancesQueried, ...item.data];
        });
        if (!instancesQueried.length) {
          yield put(actions.setError(i18next.t('Message.RETURN_ZERO_DATA')));
        } else {
          yield put(actions.instancesQueried(instancesQueried));
        }
      }
    }
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* instancesSaga() {
  yield takeLatest(actions.editCompute.type, editCompute);
  yield takeLatest(actions.loadComputes.type, getComputes);
  yield takeLatest(actions.getComputesError.type, getComputesError);
  yield takeLatest(actions.loadCompute.type, loadCompute);
  yield takeLatest(actions.deleteCompute.type, deleteCompute);
  yield takeLatest(actions.loadFlavor.type, getFlavor);
  yield takeLatest(actions.loadAction.type, performInstance);
  yield takeLatest(actions.loadConsole.type, getConsole);
  yield takeLatest(actions.getSnapshots.type, getSnapshots);
  yield takeLatest(actions.createSnapshot.type, createSnapshot);
  yield takeLatest(actions.getBackups.type, getBackups);
  yield takeLatest(actions.createBackup.type, createBackup);
  yield takeLatest(actions.createBackupSchedule.type, createBackupSchedule);
  yield takeLatest(actions.createSnapshotSchedule.type, createSnapshotSchedule);
  yield takeLatest(actions.getSnapshotSchedules.type, getSnapshotSchedules);
  yield takeLatest(actions.getBackupSchedules.type, getBackupSchedules);
  yield takeLatest(actions.deleteScheduleBackup.type, deleteScheduleBackup);
  yield takeLatest(actions.deleteScheduleSnapshot.type, deleteScheduleSnapshot);
  yield takeLatest(actions.deleteBackup.type, deleteBackup);
  yield takeLatest(actions.deleteSnapshot.type, deleteSnapshot);
  yield takeLatest(actions.rollbackSnapshot.type, rollbackSnapshot);
  yield takeLatest(actions.rollbackBackup.type, rollbackBackup);
  yield takeLatest(actions.getMonitorLog.type, getMonitorLog);
  yield takeLatest(actions.getMonitor.type, getMonitor);
  yield takeLatest(actions.reDeployCompute.type, reDeployCompute);
  yield takeLatest(actions.getActionLog.type, getActionLog);
  yield takeLatest(
    actions.queryInstancesByContractCode.type,
    queryInstancesByContractCode,
  );
  yield takeLatest(actions.queryInstances.type, queryInstances);
  yield takeLatest(
    actions.loadComputesFilterRoleUser.type,
    getComputesFilterRoleUser,
  );
}
