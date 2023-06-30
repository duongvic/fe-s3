import { Badge, Col, InputNumber, Row, Slider } from 'antd';
import React, { useState } from 'react';

interface props {
  min?: number;
  max?: number;
  step?: number;
  prefix: string;
  suffix: string;
  getData: (value, prefix) => void;
}

export default function CustomSlider({
  min,
  max,
  step,
  prefix,
  suffix,
  getData,
}: props) {
  const [inputValue, setInputValue] = useState(0);

  const onChange = value => {
    setInputValue(value);
    getData(value, prefix);
  };

  const isRequire = () => prefix !== 'Backup' && prefix !== 'Snapshot';
  return (
    <Row
      style={{ width: '100%', marginBottom: '1.5rem' }}
      align="middle"
      className="custom-slider"
    >
      <Col span={5}>
        <Badge dot={isRequire()}>{prefix === 'NET' ? 'NETWORK' : prefix}</Badge>
      </Col>
      <Col span={12}>
        <Slider
          min={min ? min : 0}
          max={max ? max : 100}
          step={step ? step : 2}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </Col>
      <Col span={5}>
        <InputNumber
          style={{ margin: '0 16px' }}
          value={inputValue}
          onChange={onChange}
          min={0}
        />
      </Col>
      <Col span={1}>{suffix}</Col>
    </Row>
  );
}
