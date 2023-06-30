import { Button, Steps } from 'antd';
import * as users from 'app/containers/Users/slice';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useInjectReducer } from 'utils/redux-injectors';
import InfoService from './InfoService';
import InfoUserForm from './InfoUserForm';
import { selectNotice } from './selectors';
import SetPackage from './SetPackage';
import * as orders from './slice';
import './styles.less';

const { Step } = Steps;

export default function OrderFormStep() {
  useInjectReducer({ key: users.sliceKey, reducer: users.reducer });

  const [current, setCurrent] = React.useState(0);
  const [canNext, setCanNext] = React.useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const notice = useSelector(selectNotice);

  const enableBtnNext = bol => {
    setCanNext(bol);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    dispatch(users.actions.setUser(null));
    dispatch(orders.actions.setProducts([]));
    dispatch(orders.actions.setCurrentOs(''));
    dispatch(orders.actions.setCurrentOsAmount(0));
  }, []);

  // useEffect(() => {
  //   if (notice === t('Message.CREATE_ORDER_SUCCESS')) {
  //     dispatch(orders.actions.loadOrders());
  //     setTimeout(() => {
  //       history.push('/dashboard/orders');
  //     }, 2000);
  //   }
  // }, [notice, history, dispatch]);

  useEffect(() => {
    if (notice === t('Message.CREATE_ORDER_SUCCESS')) {
      dispatch(orders.actions.loadOrders());
      history.push('/dashboard/orders');
    }
  }, [notice]);

  const steps = [
    {
      title: t('Title.CUSTOMER_INFO'),
      component: props => <InfoUserForm {...props} />,
    },
    {
      title: t('Title.CONTRACT_INFO'),
      component: props => <InfoService {...props} />,
    },
    {
      title: t('Title.INSTANCE_INFO'),
      component: props => <SetPackage />,
    },
  ];

  return (
    <>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {steps[current].component({ enableBtnNext })}
      </div>
      <div className="steps-action">
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()} disabled={!canNext}>
            Next
          </Button>
        )}
      </div>
    </>
  );
}
