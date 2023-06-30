import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { OrderType } from './constants';
import DataviewOrders from './DataviewOrders';
import EditOrder from './EditOrder';
import ExtendOrder from './ExtendOrder';
import RenewOrder from './RenewOrder';
import OrderFormStep from './OrderFormStep';
import { ordersSaga } from './saga';
import { selectError, selectNotice } from './selectors';
import { actions, reducer, sliceKey } from './slice';

export default function Orders() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: ordersSaga });

  const dispatch = useDispatch();

  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);

  const match = useRouteMatch();

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      dispatch(actions.setNotice(null));
    }
  }, [notice]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(null));
    }
  }, [error]);

  return (
    <Switch>
      <Route path={match.url} exact component={DataviewOrders} />
      <Route exact path={`${match.url}/create`} component={OrderFormStep} />
      <Route exact path={`${match.url}/:orderId`} component={EditOrder} />
      <Route
        exact
        path={`${match.url}/extend/:orderId`}
        render={() => <ExtendOrder orderType={OrderType.EXTEND} />}
      />
      <Route
        exact
        path={`${match.url}/renew/:orderId`}
        render={() => <RenewOrder orderType={OrderType.RENEW} />}
      />
    </Switch>
  );
}
