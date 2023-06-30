import React from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Row } from 'antd';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
}

const selectStyle = {
  background: '#24b24b',
  color: 'white',
};

export default function ChangeLanguageSelect({ className }: Props) {
  const { t, i18n } = useTranslation();

  const currentLanguage: any = localStorage.getItem('i18nextLng');

  const handleChangeLanguage = (language: string) => {
    if (language === currentLanguage) return;
    else i18n.changeLanguage(language);
  };

  const checkStyle = input => {
    if (input.some(element => element === currentLanguage)) return selectStyle;
    return;
  };
  const language = (
    <Menu
      onClick={(value: any) => handleChangeLanguage(value.key)}
      className="language"
    >
      <Menu.Item key="vi-VN" style={checkStyle(['vi', 'vi-VN'])}>
        <Row justify="space-between">Tiếng Việt</Row>
      </Menu.Item>
      <Menu.Item key="en-US" style={checkStyle(['en', 'en-US'])}>
        <Row justify="space-between">English</Row>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={language} placement="bottomCenter" arrow={true}>
      <Button type="link" className={className}>
        {t('Button.LANGUAGE').toUpperCase()}&nbsp;
        <CaretDownOutlined />
      </Button>
    </Dropdown>
  );
}
