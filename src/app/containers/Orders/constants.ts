export const Status = {
  DEPLOYED: { text: 'DEPLOYED', status: 'Processing' },
  APPROVED: { text: 'APPROVED', status: 'Success' },
  PAY_INCOMPLETE: { text: 'PAY_INCOMPLETE', status: 'Processing' },
  PAY_COMPLETED: { text: 'PAY_COMPLETED', status: 'Success' },
  PAY_LATER: { text: 'PAY_LATER', status: 'Warning' },
  PENDING: { text: 'PENDING', status: 'Warning' },
  DELETED: { text: 'DELETED', status: 'Error' },
  REJECTED: { text: 'REJECTED', status: 'Error' },
  NEW: { text: 'NEW', status: 'Default' },
};

export enum OrderType {
  BUY = 'BUY',
  TRIAL = 'TRIAL',
  UPGRADE = 'UPGRADE',
  EXTEND = 'EXTEND',
  RENEW = 'RENEW',
}

export const DiskIOPS = {
  5000: '5000',
  10000: '10000',
  15000: '15000',
  20000: '20000',
};