import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel, Row } from 'antd';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectBanners } from '../selectors';

export default function Banner(props) {
  const banners = useSelector(selectBanners);
  const ref: any = useRef(null);

  return (
    <div className="banner0 kizn902x5p-editor_css">
      <div className="carousel">
        <Row
          justify="space-between"
          style={{
            position: 'absolute',
            zIndex: 2,
            width: '95%',
            top: '44vh',
          }}
        >
          {banners?.length > 1 && (
            <>
              <LeftOutlined
                style={{ color: 'white', fontSize: 25 }}
                onClick={() => ref?.current.prev()}
              />
              <RightOutlined
                style={{ color: 'white', fontSize: 25 }}
                onClick={() => ref?.current.next()}
              />
            </>
          )}
        </Row>
        <Carousel autoplay draggable={true} speed={500} effect="fade" ref={ref}>
          {banners?.map((item, key) => (
            <Row key={key}>
              <img
                src={item}
                style={{ margin: '0 auto', height: '88vh', width: '100vw' }}
                alt=""
              />
            </Row>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
