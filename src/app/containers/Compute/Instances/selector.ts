import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.instances || initialState;

export const selectData = createSelector([selectDomain], state => state.data);

export const selectLoading = createSelector(
  [selectDomain],
  state => state.loading,
);
export const selectError = createSelector([selectDomain], state => state.error);

export const selectComputes = createSelector(
  [selectDomain],
  state => state.computes,
);

export const selectComputesError = createSelector(
  [selectDomain],
  state => state.computesError,
);

export const selectFlavor = createSelector(
  [selectDomain],
  state => state.flavor,
);

export const selectNetworks = createSelector(
  [selectDomain],
  state => state.networks,
);

export const selectSubnets = createSelector(
  [selectDomain],
  state => state.subnets,
);

export const selectSnapshots = createSelector(
  [selectDomain],
  state => state.snapshots,
);

export const selectConsole = createSelector(
  [selectDomain],
  state => state.console,
);

export const selectCompute = createSelector(
  [selectDomain],
  state => state.compute,
);

export const selectNotice = createSelector(
  [selectDomain],
  state => state.notice,
);

export const selectSnapshot = createSelector(
  [selectDomain],
  state => state.snapshot,
);

export const selectBackups = createSelector(
  [selectDomain],
  state => state.backups,
);

export const selectBackup = createSelector(
  [selectDomain],
  state => state.backup,
);

export const selectBackupSchedule = createSelector(
  [selectDomain],
  state => state.backupSchedule,
);

export const selectSnapshotSchedule = createSelector(
  [selectDomain],
  state => state.snapshotSchedule,
);

export const selectSnapshotSchedules = createSelector(
  [selectDomain],
  state => state.snapshotSchedules,
);

export const selectBackupSchedules = createSelector(
  [selectDomain],
  state => state.backupSchedules,
);

export const selectMonitorLog = createSelector(
  [selectDomain],
  state => state.monitorLog,
);
export const selectMonitor = createSelector(
  [selectDomain],
  state => state.monitor,
);
export const selectDataGetMonitor = createSelector(
  [selectDomain],
  state => state.dataGetMonitor,
);
export const selectActionLog = createSelector(
  [selectDomain],
  state => state.actionLog,
);
export const selectPagination = createSelector(
  [selectDomain],
  state => state.pagination,
);
export const selectParams = createSelector(
  [selectDomain],
  state => state.params,
);
