import 'antd/dist/antd.less';
import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useIdleTimer } from 'react-idle-timer';
// import MessengerCustomerChat from 'react-messenger-customer-chat';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
// import { trackError } from 'utils/common';
import AuthRoute from './components/AuthRoute';
// import { FACEBOOK_KEY } from './components/constant';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import {
  ForgotPassword,
  ForgotQRCode,
  RecoveryPassword,
  SignIn,
  SignUp,
} from './containers/Auth/Loadable';
import RecoveryQRCode from './containers/Auth/RecoveryQRCode';
import { authSaga } from './containers/Auth/saga';
import { selectAccount } from './containers/Auth/selectors';
import { actions, reducer, sliceKey } from './containers/Auth/slice';
import { Dashboard } from './containers/Dashboard/Loadable';
import Docs from './containers/Docs';
// import CmsChecker from './containers/Home/Landing/CmsChecker';
import { Landing, News, Profile } from './containers/Home/Loadable';
import { selectMetas } from './containers/Home/selectors';
import { usersSaga } from './containers/Users/saga';
import * as usersSlice from './containers/Users/slice';

export function App() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: authSaga });
  useInjectReducer({ key: usersSlice.sliceKey, reducer: usersSlice.reducer });
  useInjectSaga({ key: usersSlice.sliceKey, saga: usersSaga });

  const metas = useSelector(selectMetas);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const intervalRef = useRef<any>({ logout: null, refreshToken: null });
  const interval = intervalRef.current;

  // const accountInfo = useSelector(selectAccountInfo);
  const account = useSelector(selectAccount);

  const { getRemainingTime, pause, resume } = useIdleTimer({
    timeout: 15 * 60 * 1000,
  });

  const checkSignout = () => {
    const time = getRemainingTime();
    if (time === 0) {
      dispatch(actions.logout());
    }
  };

  if (!account) {
    dispatch(actions.checkSignin());
    dispatch(actions.refreshToken());
  }

  useEffect(() => {
    if (account) {
      resume();
      interval.logout = setInterval(() => {
        checkSignout();
      }, 15 * 60 * 1000 + 1);

      interval.refreshToken = setInterval(() => {
        dispatch(actions.refreshToken());
      }, 1790 * 1000);
    } else {
      pause();
      clearInterval(interval.logout);
      clearInterval(interval.refreshToken);
    }
    return () => {
      clearInterval(interval.logout);
      clearInterval(interval.refreshToken);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    // if (account && !accountInfo) {
    if (account) {
      dispatch(actions.setData({ user_name: account?.user_name }));
      dispatch(actions.queryAccount());
    }
  }, [account, dispatch]);

  // trackError;

  return (
    <>
      {/* {window.location.pathname !== '/' && <CmsChecker />}
      <MessengerCustomerChat
        pageId={FACEBOOK_KEY.pageid}
        appId={String(FACEBOOK_KEY.appid)}
        themeColor="#52c41b"
        htmlRef="/"
      /> */}
      <BrowserRouter>
        <Helmet
          titleTemplate={`%s - ${metas?.title}`}
          defaultTitle={metas?.title}
          htmlAttributes={{ lang: i18n.language }}
        >
          {Object.keys(metas ? metas : []).map(
            item =>
              item !== 'title' && (
                <meta name={item} content={metas?.[item]} key={item} />
              ),
          )}
        </Helmet>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/news/:target" component={News} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/forgot-qrcode" component={ForgotQRCode} />
          <Route exact path="/docs" component={Docs} />
          <Route
            exact
            path="/signin/recovery/:token"
            component={RecoveryPassword}
          />
          <Route
            path="/two-factor/recovery/:qrCode"
            component={RecoveryQRCode}
          ></Route>
          <Route
            exact
            path="/signin/recovery-qrcode/:token"
            component={RecoveryQRCode}
          />
          <AuthRoute path="/dashboard">
            <Dashboard />
          </AuthRoute>
          <AuthRoute exact path="/profile">
            <Profile />
          </AuthRoute>
          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </>
  );
}
