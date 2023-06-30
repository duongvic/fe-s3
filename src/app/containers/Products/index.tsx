import { notification } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import CreateForm from './CreateForm';
import Overview from './Overview';
import Product from './Product';
import { productsSaga } from './saga';
import { selectError, selectNotice } from './selectors';
import { actions, reducer, sliceKey } from './slice';

export default function Products() {
  useInjectSaga({ key: sliceKey, saga: productsSaga });
  useInjectReducer({ key: sliceKey, reducer: reducer });

  const match = useRouteMatch();
  const dispatch = useDispatch();

  const error = useSelector(selectError);
  const notice = useSelector(selectNotice);

  useEffect(() => {
    if (notice) {
      notification.success({
        message: notice,
        placement: 'bottomRight',
        duration: 6,
      });
      dispatch(actions.setNotice(null));
    }
  }, [dispatch, notice]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: error,
        placement: 'bottomRight',
        duration: 6,
      });
      dispatch(actions.setError(null));
    }
  }, [dispatch, error]);

  return (
    <Switch>
      <Route exact path={match.url} component={Overview}></Route>
      <Route exact path={`${match.url}/create`} component={CreateForm}></Route>
      <Route exact path={`${match.url}/:productId`} component={Product}></Route>
    </Switch>
  );
}
