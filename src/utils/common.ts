import moment from 'moment';

export function formatDateInTable(dataArr) {
  return dataArr?.map(data => {
    // const createdDate = moment(data.created_at).calendar(null, {
    //   sameDay: `[Today], HH:mm`,
    //   nextDay: 'YYYY-MM-DD',
    //   nextWeek: 'YYYY-MM-DD',
    //   lastDay: 'YYYY-MM-DD',
    //   lastWeek: 'YYYY-MM-DD',
    //   sameElse: 'YYYY-MM-DD',
    // });
    const createdDate = data?.created_at ? moment.utc(data?.created_at) : moment.utc(data?.created_at);
    const startAt = data?.start_at ? moment.utc(data?.start_at) : moment.utc(data?.order_dtl?.start_at);
    const endAt = data?.end_at ? moment.utc(data?.end_at) : moment.utc(data?.order_dtl?.end_at);
    return {
      ...data,
      created_at: createdDate,
      end_at: endAt,
      start_at: startAt,
    };
  });
}

export function sortDate(a, b) {
  return moment(a).diff(moment(b));
}

export const fillValuesToForm = (values, form) => {
  form.setFieldsValue({ ...values });
};

export const capitalizeText = str => str[0]?.toUpperCase() + str.slice(1);

export const capitalizeUnderscoreText = str => {
  let strArray = str.toLowerCase().split('_')
  if (strArray.length <= 1) return str
  let newArray = strArray.map(item => capitalizeText(item))
  var newStr = newArray.join(' ')
  // console.log(newStr)
  return newStr
}

export const setConditions = params => {
  let condition: string = '';
  Object.keys(params).forEach(element => {
    if (params[element])
      // condition += String(`${element}__eq__${params[element]},`);
      condition += String(`${element}=${params[element]}&`);
  });
  condition = condition.slice(0, -1);
  return condition;
};

export const autoFillToDurationField = (changedFields, allFields, form) => {
  const name = changedFields[0].name[0];

  if (name === 'start_at' || name === 'end_at') {
    const start = form.getFieldValue('start_at')?.unix();
    const end = form.getFieldValue('end_at')?.unix();
    if (end > start) {
      const duration = Math.floor((end - start) / (60 * 60 * 24));
      fillValuesToForm({ duration }, form);
    } else {
      fillValuesToForm({ duration: null }, form);
    }
  }
};

export const exportCSV = (arr, data) => {
  const result: any = data?.map(item => {
    const obj: any = {};
    arr?.map(ele => {
      obj[capitalizeText(ele.replace('_', ' '))] = item[ele];
    });
    return obj;
  });
  return result;
};

// export const trackError = window.addEventListener('error', function (e: any) {
//   let stacktrace = e.stack;
//   if (!stacktrace && e.error) {
//     stacktrace = e.error.stack;
//   }

//   // For now, just print the error
//   console.log(e.message + ', ' + e.filename + ', ' + e.lineno + ':' + e.colno);
//   if (stacktrace) {
//     console.log('Stacktrace: ' + stacktrace);
//   }
// });

export const getFromSetting = (target: string) => {
  let setting: any = localStorage.getItem('setting');
  setting = setting ? JSON.parse(setting) : {};
  return setting[target];
};

export const setSetting = newSetting => {
  let localSetting: any = localStorage.getItem('setting');
  localSetting = localSetting ? JSON.parse(localSetting) : {};
  localSetting = { ...localSetting, ...newSetting };
  localStorage.setItem('setting', JSON.stringify(localSetting));
};
