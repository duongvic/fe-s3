import { Button, Modal, Row, Select } from 'antd';
import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { capitalizeText, exportCSV } from 'utils/common';

interface Props {
  visible: boolean;
  arr: any;
  data: any;
  filename: string;
  onCancel: any;
}

export default function ModalDowloadCSV({
  visible,
  arr,
  data,
  filename,
  onCancel,
}: Props) {
  // const localSetting: any = localStorage.getItem('setting');
  // let setting = localSetting ? JSON.parse(localSetting) : {};
  // const defaultColumn = setting[filename.replace(` Data.csv`, 'CSV')] || [];

  const [chosenColumns, setChosenColumns]: any = useState(arr);

  const { t } = useTranslation('constant');

  const handleClickDownload = () => {
    // setting[filename.replace(` Data.csv`, 'CSV')] = chosenColumns;
    // setting = { ...JSON.parse(localSetting), ...setting };
    // setting = JSON.stringify(setting);
    // localStorage.setItem('setting', setting);

    onCancel();
  };

  const onChange = e => {
    if (e.includes('all')) {
      setChosenColumns(arr);
    } else setChosenColumns(e);
  };

  const handleClear = () => {
    setChosenColumns([]);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title={t('Title.SELECT_COLUMNS')}
      footer={[]}
    >
      <Select
        onChange={onChange}
        placeholder="Select columns"
        value={chosenColumns}
        mode="multiple"
        allowClear
        onClear={handleClear}
        style={{ width: '100%' }}
      >
        <Select.Option value="all">{t('Button.SELECT_ALL')}</Select.Option>
        {arr.map(item => (
          <Select.Option value={item} key={item}>
            {capitalizeText(item.replace('_', ' '))}
          </Select.Option>
        ))}
      </Select>
      <br />
      <br />
      <Row justify="space-around">
        <CSVLink
          key="csv"
          filename={filename}
          className="btn btn-primary"
          data={exportCSV(chosenColumns, data)}
        >
          <Button type="primary" onClick={handleClickDownload}>
            {t('Button.DOWNLOAD')}
          </Button>
        </CSVLink>
        <Button key="cancel" danger type="primary" onClick={onCancel}>
          {t('Button.CANCEL')}
        </Button>
      </Row>
    </Modal>
  );
}
