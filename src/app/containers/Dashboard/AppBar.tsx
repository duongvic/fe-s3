// import { AudioOutlined } from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
// import Search from 'antd/lib/input/Search';
import ChangeLanguageSelect from 'app/components/ChangeLanguageSelect';
import { actions, reducer, sliceKey } from 'app/containers/Orders/slice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { ordersSaga } from '../Orders/saga';
import {
  // selectLoading,
  // selectRegion,
  // selectRegions,
} from '../Orders/selectors';
import AvatarUser from './AvatarUser';
// import Notification from './Notification';
import './styles.less';

// const { Option } = Select;

export default function AppBar() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: ordersSaga });

  const dispatch = useDispatch();

  // const regions = useSelector(selectRegions);
  // const region = useSelector(selectRegion);
  // const loading = useSelector(selectLoading)?.regions;

  //Search Input Voice
  // const suffix = (
  //   <AudioOutlined
  //     style={{
  //       fontSize: 16,
  //       color: '#1890ff',
  //     }}
  //   />
  // );

  useEffect(() => {
    // debugger;
    dispatch(actions.getRegions());
  }, [dispatch]);

  //Handle change Region
  // const onSelect = value => {
  //   dispatch(actions.setRegion(value));
  // };

  // const onSearch = value => console.log(value);

  // const optionRegion = regions?.map(region => (
  //   <Option key={region?.id} value={region?.id}>
  //     {region?.name}
  //   </Option>
  // ));

  return (
    <Row justify="end">
      {/* <Row justify="space-between" align="middle"> */}
      {/* <Col md={8} xs={0}>
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          suffix={suffix}
          onSearch={onSearch}
          style={{ verticalAlign: 'middle' }}
        />
      </Col> */}

      <Col xs={22} md={13} style={{ marginRight: 40 }}>
        <Row justify="end">
          <Space align="center" size="large">
            <ChangeLanguageSelect className="AppBar--ChangeLanguageSelect" />
            {/* {loading ? (
              <Spin />
            ) : (
              <Select value={region} style={{ width: 80 }} onSelect={onSelect}>
                {optionRegion}
              </Select>
            )} */}

            {/* <Notification /> */}
            <AvatarUser />
          </Space>
        </Row>
      </Col>
    </Row>
  );
}
