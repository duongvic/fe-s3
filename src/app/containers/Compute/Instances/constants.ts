export const Status = {
  ACTIVE: { text: 'ACTIVE', status: 'Success' },
  SUCCEEDED: { text: 'SUCCEEDED', status: 'Success' },
  BUILD: { text: 'BUILD', status: 'Processing' },
  REBOOT: { text: 'REBOOT', status: 'Processing' },
  PAUSED: { text: 'PAUSED', status: 'Warning' },
  RESIZE: { text: 'RESIZE', status: 'Warning' },
  SHUTOFF: { text: 'SHUTOFF', status: 'Error' },
  FAILED: { text: 'FAILED', status: 'Error' },
  DELETED: { text: 'DELETED', status: 'Error' },
  ERROR: { text: 'ERROR', status: 'Error' },
  SUSPENDED: { text: 'SUSPENDED', status: 'Error' },
  PASSWORD: { text: 'PASSWORD', status: 'Default' },
  UNKNOWN: { text: 'UNKNOWN', status: 'Default' },
};

export const Pattern = {
  IP: /^[0-9]{1,}.[0-9]{1,}.[0-9]{1,}.[0-9]{1,}[/][0-9]{1,3}$/,
  PORT_RANGE: /^[0-9]{1,}:[0-9]{1,}$/,
};

export enum Action {
  START = 'start',
  STOP = 'stop',
  REBOOT = 'reboot',
  RESUME = 'resume',
  SUSPEND = 'suspend',
}

//export function sampleLogData(target) {
//  let count = 1556888400;
//  let interval = setInterval(() => {
//    count += 60 * 60;
//    let value = Math.floor(Math.random() * (100 - 1) + 1);
//    target.update({ time: count, value: value });
//
//    if (count > 1556888400 + 60 * 60 * 20) {
//      clearInterval(interval);
//    }
//  }, 1000);
//}

export const chartBlue = {
  topColor: 'rgba(33, 150, 243, 0.56)',
  bottomColor: 'rgba(33, 150, 243, 0.04)',
  lineColor: 'rgba(33, 150, 243, 1)',
  lineWidth: 2,
};
export const chartGreen = {
  topColor: 'rgba(76, 175, 80, 0.5)',
  lineColor: 'rgba(76, 175, 80, 1)',
  bottomColor: 'rgba(76, 175, 80, 0)',
  lineWidth: 2,
};
export const chartOrange = {
  topColor: 'rgba(245, 124, 0, 0.4)',
  bottomColor: 'rgba(245, 124, 0, 0.1)',
  lineColor: 'rgba(245, 124, 0, 1)',
  lineWidth: 2,
};
