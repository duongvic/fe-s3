import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { noticficationBase } from 'utils/constant';
import DataviewInstances from '../Compute/Instances/DataviewInstances';
import {
  selectError,
  selectNotice,
  selectParams,
} from '../Compute/Instances/selector';
import { actions, defaultState } from '../Compute/Instances/slice';
import { selectUser } from '../Users/selectors';

export default function Instances() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const paramsRedux = useSelector(selectParams);
  const params = useParams<any>();
  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);

  const userId = Number(user?.id ?? params.userId);

  useEffect(() => {
    if (notice) {
      noticficationBase('success', notice);
      dispatch(actions.setNotice(defaultState.notice));
    }
  }, [notice]);
  useEffect(() => {
    if (error) {
      noticficationBase('error', error);
      dispatch(actions.setError(defaultState.error));
    }
  }, [error]);

  useEffect(() => {
    if (
      !paramsRedux ||
      !paramsRedux?.target_user_id ||
      paramsRedux?.target_user_id !== userId
    ) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams({ target_user_id: userId }));
      dispatch(actions.queryInstances());
    }
  }, []);

  return <DataviewInstances />;
}
