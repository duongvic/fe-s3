import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en/translation.json';
import vi from './vi/translation.json';
import docsEn from './en/docs.json';
import docsVi from './vi/docs.json';
import letterEn from './en/letter.json';
import letterVi from './vi/letter.json';
import introductionEn from './en/introduction.json';
import introductionVi from './vi/introduction.json';
import constant from './constant/constant.json';
import { convertLanguageJsonToObject } from './translations';

export const translationsJson = {
  vi: {
    translation: vi,
    constant: constant,
    docs: docsVi,
    introduction: introductionVi,
    letter: letterVi,
  },
  en: {
    translation: en,
    constant: constant,
    docs: docsEn,
    introduction: introductionEn,
    letter: letterEn,
  },
};

convertLanguageJsonToObject(vi);

const i18nLng = localStorage.getItem('i18nextLng');

const checkLng = i18nLng => {

  if (['vi-VN', 'en-US'].some(ele => ele === i18nLng)) return i18nLng;
  return 'en-US';
};
export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: translationsJson,
    lng: checkLng(i18nLng),
    debug:
      process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });
