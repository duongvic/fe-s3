import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { noticficationBase } from 'utils/constant';
import { selectError, selectNotice, selectParams } from '../Orders/selectors';
import { actions, defaultState } from '../Orders/slice';
import { selectUser } from '../Users/selectors';
import DataviewOrders from '../Orders/DataviewOrders';

export default function Orders() {
  const user = useSelector(selectUser);
  const notice = useSelector(selectNotice);
  const error = useSelector(selectError);
  const paramsRedux = useSelector(selectParams);

  const params = useParams<any>();
  const dispatch = useDispatch();

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
      !paramsRedux.hasOwnProperty('customer_id') ||
      paramsRedux.customer_id !== params.userId
    ) {
      dispatch(actions.setPagination({ ...defaultState.pagination }));
      dispatch(actions.setParams({ customer_id: params.userId }));
      // console.log(
      //   'paramsRedux:',
      //   paramsRedux,
      //   'userId:',
      //   userId,
      //   'params.userId:',
      //   params.userId,
      // );
      dispatch(actions.queryOrders());
    }
  }, []);
  return <DataviewOrders />;
}
