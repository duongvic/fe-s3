import { selectAccount } from 'app/containers/Auth/selectors';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { noticficationBase } from 'utils/constant';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import ComputesError from './ComputesError';
import DataviewInstances from './DataviewInstances';
import { DetailsInstance } from './DetailsInstance';
import { instancesSaga } from './saga';
import { selectError, selectNotice } from './selector';
import { actions, reducer, sliceKey } from './slice';

export default function Instances() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: instancesSaga });

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);
  const account = useSelector(selectAccount);

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      dispatch(actions.setNotice(null));
    }
  }, [notice, dispatch]);

  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      switch (error) {
        case t('Message.INSTANCE_NOT_FOUND'):
          history.push('/dashboard');
          break;
        default:
          break;
      }
      dispatch(actions.setError(null));
    }
  }, [error, dispatch]);

  return (
    <Switch>
      <Route path={match.url} exact component={DataviewInstances} />
      {/* <Route
        exact
        path={`${match.url}/create`}
        component={ConfigInstancesForm}
      /> */}
      {['ADMIN', 'IT_ADMIN'].some(
        ele => ele === account?.role?.toUpperCase(),
      ) && (
        <Route exact path={`${match.url}/error`} component={ComputesError} />
      )}
      <Route
        exact
        path={`${match.url}/:instanceId`}
        component={DetailsInstance}
      />
    </Switch>
  );
}
