import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

interface Props {
  visible: boolean;
  setVisible: any;
}

export default function ModalCheckTwoFactor(props: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const onCancel = () => {
    history.push('/dashboard/profile');
  };
  return (
    <Modal
      visible={props.visible}
      title={
        <Typography.Text>
          <ExclamationCircleTwoTone twoToneColor="#24B24B" />
          &nbsp; {t('Title.NOTIFICATION').toUpperCase()}
        </Typography.Text>
      }
      okText={t('Button.SETTING')}
      cancelText={t('Button.CANCEL')}
      onCancel={onCancel}
      onOk={() => {
        history.push('/dashboard/profile#security_option');
      }}
    >
      <Typography.Text>{t('Message.REQUIRE_TWO_FACTOR')}</Typography.Text>
    </Modal>
  );
}
