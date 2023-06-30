import { Col, Row } from 'antd';
import React from 'react';
import LandingBase from '../Home/Landing/LandingBase';
import Content from './Content';
import Siderbar from './Siderbar';
export default function Layout() {

  return (
    <LandingBase>
      <Row className="docs" justify="space-between">
        <Col md={6} xs={0}>
          <Siderbar></Siderbar>
        </Col>
        <Col lg={18} xs={24}>
          <Row justify="start">
            <Col lg={20} xs={24}>
              <Content></Content>
            </Col>
          </Row>
        </Col>
      </Row>
    </LandingBase>
  );
}
