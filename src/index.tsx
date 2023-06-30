import { App } from 'app';
// import { SITE_KEY_V3 } from 'app/components/constant';
import i18next from 'i18next';
import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as ReactDOM from 'react-dom';
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import { configureAppStore } from 'store/configureStore';

import './locales/i18n';

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;
ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        {/* <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY_V3}> */}
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
        {/* </GoogleReCaptchaProvider> */}
      </React.StrictMode>
    </HelmetProvider>
  </Provider>,
  MOUNT_NODE,
);

if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {});
}

serviceWorker.unregister();
