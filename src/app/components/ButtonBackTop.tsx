import { ArrowUpOutlined } from '@ant-design/icons';
import { BackTop, Row } from 'antd';
import React from 'react';

export default function ButtonBackTop() {
  return (
    <BackTop style={{ bottom: 110, right: 28 }}>
      <Row
        justify="center"
        align="middle"
        style={{
          height: 60,
          width: 60,
          background: '#52c41a',
          borderRadius: '50%',
          border: '5px solid #a4f57d',
        }}
      >
        <ArrowUpOutlined style={{ color: 'white' }} />
      </Row>
    </BackTop>
  );
}
