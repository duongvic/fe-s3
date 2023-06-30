import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { selectAccount } from '../Auth/selectors';
import User from '../User';
import { USER_CREATE } from './constants';
import CreateUser from './CreateUser';
import OverviewUsers from './DataviewUsers';
import { usersSaga } from './saga';
import { reducer, sliceKey } from './slice';

export default function Users() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: usersSaga });

  const match = useRouteMatch();

  const account = useSelector(selectAccount);

  return (
    <Switch>
      <Route exact path={match.url} component={OverviewUsers} />
      {account?.permission?.includes(USER_CREATE) && (
        <Route exact path={`${match.url}/create`} component={CreateUser} />
      )}
      <Route exact path={`${match.url}/:userId`} component={User} />
    </Switch>
  );
}
