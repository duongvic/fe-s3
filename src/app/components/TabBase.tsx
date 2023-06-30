import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Col, Row } from 'antd';
import React from 'react';

const TabBase = (children, tab, key) => {
  return (
    <TabPane style={{ padding: 0 }} tab={tab} key={key}>
      <Row className="steps-content" style={{ margin: 0 }}>
        <Col span={18} push={3}>
          {children}
        </Col>
      </Row>
    </TabPane>
  );
};

export default TabBase;
