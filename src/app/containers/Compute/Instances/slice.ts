import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';

export const defaultState: any = {
  data: null,
  params: null,
  dataGetMonitor: null,
  computes: [],
  computesError: [],
  compute: null,
  flavor: null,
  loading: false,
  error: null,
  networks: null,
  subnets: null,
  snapshots: [],
  snapshot: null,
  actionLog: null,
  notice: null,
  console: null,
  conditions: null,
  backups: [],
  backup: null,
  backupSchedule: null,
  snapshotSchedule: null,
  snapshotSchedules: [],
  backupSchedules: [],
  pagination: { current: 1, pageSize: 10, total: 1 },
  monitor: {
    cpu: [],
    ram: [],
    disk: { read: [], write: [] },
    network: { receiver: [], transfer: [] },
    iops: { receiver: [], transfer: [] },
  },
  monitorLog: {
    cpu: [],
    ram: [],
    disk: { read: [], write: [] },
    network: { receiver: [], transfer: [] },
    iops: { receiver: [], transfer: [] },
  },
  zones: null,
};

export const initialState: any = { ...defaultState };

const instancesSlice = createSlice({
  name: 'instances',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    setParams(state, action: PayloadAction<any>) {
      state.params = action.payload;
    },
    setDataGetMonitor(state, action: PayloadAction<any>) {
      state.dataGetMonitor = action.payload;
    },
    setSnapshot(state, action: PayloadAction<any>) {
      state.snapshot = action.payload;
    },
    setBackup(state, action: PayloadAction<any>) {
      state.backup = action.payload;
    },
    getComputesError(state) {
      state.computesError = [];
      state.loading = { computesError: true };
    },
    computesErrorGetted(state, action: PayloadAction<any>) {
      state.computesError = action.payload;
      state.loading = false;
    },
    loadComputes(state) {
      state.error = null;
      state.computes = [];
      state.loading = { computes: true };
    },
    loadComputesFilterRoleUser(state) {
      state.error = null;
      state.computes = [];
      state.loading = { computes: true };
    },
    computesLoaded(state, action: PayloadAction<any>) {
      state.computes = action.payload;
      state.loading = false;
    },
    loadCompute(state) {
      state.error = null;
      state.compute = null;
      state.loading = { compute: true };
    },
    setPagination(state, action: PayloadAction<any>) {
      state.pagination = action.payload;
    },
    computeLoaded(state, action: PayloadAction<any>) {
      state.compute = action.payload;
      state.loading = false;
      state.data = null;
      state.snapshots = [];
      state.backups = [];
      state.console = null;
      state.actionLog = null;
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
      state.data = null;
    },
    loadFlavor(state) {
      state.loading = { flavor: true };
      state.error = null;
      state.flavor = null;
    },
    loadNetworks(state) {
      state.loading = { networks: true };
      state.error = null;
      state.networks = null;
    },
    loadSubnets(state) {
      state.loading = { subnets: true };
      state.error = null;
      state.subnets = null;
    },
    flavorLoaded(state, action: PayloadAction<any>) {
      state.flavor = action.payload;
      state.loading = false;
    },
    networksLoaded(state, action: PayloadAction<any>) {
      state.networks = action.payload;
      state.loading = false;
    },
    subnetsLoaded(state, action: PayloadAction<any>) {
      state.subnets = action.payload;
      state.loading = false;
    },
    getSnapshots(state) {
      state.loading = { snapshots: true };
      state.error = null;
      state.snapshots = [];
    },
    snapshotsGetted(state, action: PayloadAction<any>) {
      state.snapshots = action.payload;
      state.loading = false;
      state.data = null;
    },
    getBackups(state) {
      state.loading = { backups: true };
      state.error = null;
      state.backups = [];
    },
    backupsGetted(state, action: PayloadAction<any>) {
      state.backups = action.payload;
      state.loading = false;
      state.data = null;
    },
    createSnapshot(state) {
      state.loading = { snapshot: true };
      state.error = null;
      state.snapshot = null;
    },
    snapshotCreated(state, action: PayloadAction<any>) {
      state.snapshot = action.payload;
      state.loading = false;
      state.data = null;
    },
    createBackup(state) {
      state.loading = { backup: true };
      state.error = null;
      state.backup = null;
    },
    backupCreated(state, action: PayloadAction<any>) {
      state.backup = action.payload;
      state.loading = false;
      state.data = null;
    },
    createBackupSchedule(state) {
      state.loading = { createSchedule: true };
      state.error = null;
      state.backupSchedule = null;
    },
    backupScheduleCreated(state, action: PayloadAction<any>) {
      state.backupSchedule = action.payload;
      state.loading = false;
      state.data = null;
    },
    getBackupSchedules(state) {
      state.loading = { getSchedules: true };
      state.error = null;
      state.backupSchedules = [];
    },
    backupSchedulesGetted(state, action: PayloadAction<any>) {
      state.backupSchedules = action.payload;
      state.loading = false;
      state.data = null;
    },
    createSnapshotSchedule(state) {
      state.loading = { createSchedule: true };
      state.error = null;
      state.snapshotSchedule = null;
    },
    snapshotScheduleCreated(state, action: PayloadAction<any>) {
      state.snapshotSchedule = action.payload;
      state.loading = false;
      state.data = null;
    },
    getSnapshotSchedules(state) {
      state.loading = { getSchedules: true };
      state.error = null;
      state.snapshotSchedules = [];
    },
    snapshotSchedulesGetted(state, action: PayloadAction<any>) {
      state.snapshotSchedules = action.payload;
      state.loading = false;
      state.data = null;
    },
    setNotice(state, action: PayloadAction<any>) {
      state.notice = action.payload;
      state.loading = false;
      state.data = null;
    },
    loadAction(state) {
      state.error = null;
      state.notice = null;
    },
    loadConsole(state) {
      state.loading = { console: true };
      state.error = null;
    },
    consoleLoaded(state, action: PayloadAction<any>) {
      state.loading = false;
      state.console = action.payload;
    },
    deleteCompute(state) {
      state.error = null;
      state.notice = null;
    },
    deleteScheduleSnapshot(state) {
      state.error = null;
      state.notice = null;
    },
    deleteScheduleBackup(state) {
      state.error = null;
      state.notice = null;
    },
    deleteBackup(state) {
      state.error = null;
      state.notice = null;
    },
    deleteSnapshot(state) {
      state.error = null;
      state.notice = null;
    },
    rollbackSnapshot(state) {
      state.error = null;
      state.notice = null;
    },
    rollbackBackup(state) {
      state.error = null;
      state.notice = null;
    },
    getMonitor(state) {
      state.error = null;
      state.notice = null;
    },
    monitorGetted(state, action: PayloadAction<any>) {
      state.monitor = action.payload;
    },
    getMonitorLog(state) {
      state.loading = { monitorLog: true };
      state.monitorLog = {
        cpu: [],
        ram: [],
        disk: { read: [], write: [] },
        network: { receiver: [], transfer: [] },
        iops: { receiver: [], transfer: [] },
      };
      state.error = null;
      state.notice = null;
    },
    monitorLogGetted(state, action: PayloadAction<any>) {
      state.monitorLog = action.payload;
      state.loading = false;
      state.data = null;
    },
    reDeployCompute() {},
    getActionLog(state) {
      state.loading = true;
    },
    actionLogLoaded(state, action: PayloadAction<any>) {
      state.actionLog = action.payload;
      state.loading = false;
      state.data = null;
    },
    editCompute(state) {
      state.loading = { compute: true };
    },
    queryInstances(state) {
      state.loading = { computes: true };
      state.computes = defaultState.computes;
    },
    queryInstancesByContractCode(state) {
      state.loading = { computes: true };
      state.computes = defaultState.computes;
    },
    instancesQueried(state, action: PayloadAction<any>) {
      state.computes = action.payload;
      state.loading = false;
      state.data = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = instancesSlice;
