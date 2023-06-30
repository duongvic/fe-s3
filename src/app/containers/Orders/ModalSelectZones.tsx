import { Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { selectAccount } from '../Auth/selectors';
import { ordersSaga } from './saga';
import { selectRegion, selectZones } from './selectors';
import { actions, reducer, sliceKey } from './slice';

interface Props {
  closeModal: () => void;
  visible: boolean;
  deployCompute: (zone) => void;
}

export default function ModalSelectZones({
  closeModal,
  visible,
  deployCompute,
}: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: ordersSaga });
  const { t } = useTranslation('constant');

  const [zone, setZone]: any = useState(null);

  const zones = useSelector(selectZones);
  const account = useSelector(selectAccount);
  const region = useSelector(selectRegion);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !zones &&
      (account?.role?.toUpperCase() === 'IT_ADMIN' || account?.role?.toUpperCase() === 'ADMIN') &&
      visible
    ) {
      dispatch(actions.setData({ regionId: region }));
      dispatch(actions.loadZones());
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onOk={() => deployCompute(zone)}
      onCancel={() => closeModal()}
      title={t('Placeholder.DEPLOY_ZONE')}
    >
      <Select
        style={{ width: '100%' }}
        onChange={value => setZone(value)}
        placeholder={t('Placeholder.DEPLOY_ZONE')}
      >
        {zones?.map(item => (
          <Select.Option key={item.name} value={item.name}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
}
