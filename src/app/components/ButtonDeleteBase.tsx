import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  loading: boolean;
  onConfirm: () => void;
  requirePassword?: boolean;
  disabled?: boolean;
  size?: any;
  rest?: any;
}

export default function ButtonDeleteBase({
  loading,
  onConfirm,
  requirePassword,
  disabled,
  size,
  ...rest
}: props) {
  const { t } = useTranslation(['translation', 'constant']);

  const isRequirePassword = () => (
    <>
      <Typography>{t('Message.REQUIRE_PASSWORD')}</Typography>
      <Input />
    </>
  );

  return (
    <Popconfirm
      {...rest}
      disabled={disabled}
      placement="right"
      title={
        requirePassword ? isRequirePassword : t('Field_Message.CONFIRM_DELETE')
      }
      onConfirm={onConfirm}
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      okText={t('constant:Button.OK')}
      cancelText={t('constant:Button.CANCEL')}
    >
      <Button
        size={size ?? 'small'}
        danger
        loading={loading}
        disabled={disabled}
      >
        {t('constant:Button.DELETE')}
      </Button>
    </Popconfirm>
  );
}
