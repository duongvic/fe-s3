import { notification } from 'antd';

export const noticeSetting = {
  placement: 'bottomRight',
  duration: 5,
};

export const noticficationBase = (status, message) => {
  notification[status]({ message, ...noticeSetting });
};


export const phoneFormatter = (e) => {
  if (!e.target.value) return undefined;
  const num = e.target.value.replace(/[^0-9]/g, '');
  return num.length >= 11 ? num.substr(0, 10) : num;
}

export const moneyFormatter = (e) => {
  if (!e.target.value) return undefined;
  const num = e.target.value.replace(/[^0-9]/g, '');
  return formatMoney(num.toString());
};

export const formatMoney = (currency) => {
  if (currency?.length > 3) {
    let length = currency?.length;
    let newCurrency;
    let remainPart;
    newCurrency = currency.substr(length - 3, length);
    remainPart = currency.substr(0, length - newCurrency.length);
    remainPart = formatMoney(remainPart);
    return remainPart + ',' + newCurrency;
  } else {
    return currency;
  }
};

export const phoneNumberRegex = /(032|033|034|035|036|037|038|039|086|096|097|098|0162|0163|0164|0165|0166|0167|0168|0169|081|082|083|084|085|088|091|094|0123|0124|0125|0127|0129|070|076|077|078|079|089|090|093|0120|0121|0122|0126|056|058|092|0188|0186|059|099|0199)+([0-9]{7})\b/g;

// email
export const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;