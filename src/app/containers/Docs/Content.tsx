import { Row, Space, Typography } from 'antd';
import img1_1_1 from 'assets/img/docs/1.1.png';
import img1_2_1 from 'assets/img/docs/1.2.1.png';
import img1_2_2 from 'assets/img/docs/1.2.2.png';
import img1_2_3 from 'assets/img/docs/1.2.3.png';
import img2_1_1 from 'assets/img/docs/2.1.1.png';
import img2_1_2 from 'assets/img/docs/2.1.2.png';
import img2_2_1 from 'assets/img/docs/2.2.png';
import img2_3_1 from 'assets/img/docs/2.3.png';
import img2_4_1 from 'assets/img/docs/2.4.1.png';
import img2_4_2 from 'assets/img/docs/2.4.2.png';
import img2_4_3 from 'assets/img/docs/2.4.3.png';
import img2_4_4 from 'assets/img/docs/2.4.4.png';
import img2_4_5 from 'assets/img/docs/2.4.5.png';
import img2_4_6 from 'assets/img/docs/2.4.6.png';
import img2_4_7 from 'assets/img/docs/2.4.7.png';
import img2_5_2 from 'assets/img/docs/2.5.2.png';
import img2_5_3 from 'assets/img/docs/2.5.3.png';
import img2_5_4 from 'assets/img/docs/2.5.4.png';
import img2_5_5 from 'assets/img/docs/2.5.5.png';
import img2_6_1 from 'assets/img/docs/2.6.1.png';
import img2_6_2 from 'assets/img/docs/2.6.2.png';
import img2_6_3 from 'assets/img/docs/2.6.3.png';
import img2_7_1 from 'assets/img/docs/2.7.1.png';
import img2_7_2 from 'assets/img/docs/2.7.2.png';
import img2_7_3 from 'assets/img/docs/2.7.3.png';
import img3_1_1 from 'assets/img/docs/3.1.1.png';
import img3_1_2 from 'assets/img/docs/3.1.2.png';
import img3_2_1 from 'assets/img/docs/3.2.1.png';
import img3_2_2 from 'assets/img/docs/3.2.2.png';
import img3_3_1 from 'assets/img/docs/3.3.png';
import img3_4_1 from 'assets/img/docs/3.4.1.png';
import img3_4_2 from 'assets/img/docs/3.4.2.png';
import img3_5_1 from 'assets/img/docs/3.5.png';
import img3_6_1 from 'assets/img/docs/3.6.png';
import img3_7_1 from 'assets/img/docs/3.7.png';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Content = React.memo(() => {
  const { t } = useTranslation('docs');

  const replaceInput = input => t(input.replaceAll('.', ' '))

  const renderTitle = (input: string) => (
    <Row justify="center" align="middle">
      <Typography.Title level={2} id={input}>
        {replaceInput(input)}
      </Typography.Title>
    </Row>
  );



  const renderSubtitle = (input: string) => {
    return (
      <Typography.Title level={3} id={input}>
        {replaceInput(input)}
      </Typography.Title>
    );
  };

  const renderSentence = (input: string, id?: boolean) => (
    <>
      <Typography.Text id={id ? input : ''} style={{ fontSize: 17 }}>
        {replaceInput(input)}
      </Typography.Text>
      <br />
      <br />
    </>
  );

  const renderImg = (img, input?: string, imgStyle?: object) => (
    <Space direction="vertical" align="center" style={{ width: '100%' }}>
      <img src={img} alt="" style={{ maxWidth: '41rem', height: '23rem', ...imgStyle }} />
      <Typography.Text style={{ fontSize: 17 }}>
        {input ? replaceInput(input) : ''}
      </Typography.Text>
      <br />
    </Space>
  );

  const renderLi = (input: string) => {
    return <li style={{ fontSize: 14 }}>{replaceInput(input)}</li>;
  };

  return (
    <>
      <div className="page">
        {renderTitle('1')}
        {renderSubtitle('1.1')}
        {renderImg(img1_1_1, '1.1.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('1.1.B1')}
          {renderLi('1.1.B2')}
          {renderLi('1.1.B3')}
          {renderLi('1.1.B4')}
          {renderLi('1.1.B5')}
        </ul>
        {renderSubtitle('1.2')}
        {renderImg(img1_2_1, '1.2.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('1.2.B1')}
          {renderLi('1.2.B2')}
          {renderLi('1.2.B3')}
        </ul>
        {renderSentence('1.2.SUB_TITLE', true)}
        <Row style={{ flexWrap: 'nowrap' }} justify="space-around">
          {renderImg(img1_2_2, '1.2.Img2', { height: '23rem' })}
          {renderImg(img1_2_3, '1.2.Img3', { height: '23rem' })}
        </Row>
        {renderSentence('Steps')}
        <ul>
          {renderLi('1.2.SUB_TITLE.B1')}
          {renderLi('1.2.SUB_TITLE.B2')}
          {renderLi('1.2.SUB_TITLE.B3')}
          {renderLi('1.2.SUB_TITLE.B4')}
        </ul>
      </div>
      <div className="page">
        {renderTitle('2')}
        {renderSubtitle('2.1')}
        {renderImg(img2_1_1, '2.1.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.1.B1')}
          {renderLi('2.1.B2')}
          {renderImg(img2_1_2, '2.1.Img2')}
          {renderLi('2.1.B3')}
          {renderLi('2.1.B4')}
          {renderLi('2.1.B5')}
        </ul>
        {renderSubtitle('2.2')}
        {renderImg(img2_2_1, '2.2.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.2.B1')}
          {renderLi('2.2.B2')}
          {renderLi('2.2.B3')}
          {renderLi('2.2.B4')}
        </ul>
        {renderSubtitle('2.3')}
        {renderImg(img2_3_1, '2.3.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.3.B1')}
          {renderLi('2.3.B2')}
          {renderLi('2.3.B3')}
          {renderLi('2.3.B4')}
        </ul>

        {renderSubtitle('2.4')}
        {renderImg(img2_4_1, '2.4.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.4.B1')}
          {renderLi('2.4.B2')}
          {renderImg(img2_4_2, '2.4.Img2')}
          {renderLi('2.4.B3')}
          <Row style={{ flexWrap: 'nowrap' }} justify="space-around">
            {renderImg(img2_4_3)}
            {renderImg(img2_4_4)}
          </Row>
          {renderLi('2.4.B4')}
          {renderImg(img2_4_5, '2.4.Img3', { height: '12rem' })}
          {renderLi('2.4.B5')}
          {renderLi('2.4.B6')}
          {renderImg(img2_4_6, '2.4.Img4')}
          {renderLi('2.4.B7')}
        </ul>
        {renderImg(img2_4_7, '2.4.Img5', { height: '23rem' })}

        {renderSubtitle('2.5')}
        {renderImg(img2_4_1, '2.5.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.5.B1')}
          {renderLi('2.5.B2')}
          {renderImg(img2_5_2, '2.5.Img2')}
          {renderLi('2.5.B3')}
          <Row style={{ flexWrap: 'nowrap' }} justify="space-around">
            {renderImg(img2_5_3)}
            {renderImg(img2_5_4)}
          </Row>
          {renderLi('2.5.B4')}
          {renderLi('2.5.B5')}
          {renderImg(img2_4_5, '2.5.Img3', { height: '12rem' })}
          {renderLi('2.5.B6')}
          {renderImg(img2_4_6, '2.5.Img4')}
          {renderLi('2.5.B7')}
        </ul>
        {renderImg(img2_5_5, '2.5.Img5', { height: '23rem' })}

        {renderSubtitle('2.6')}
        {renderImg(img2_4_1, '2.6.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.6.B1')}
          {renderLi('2.6.B2')}
          {renderLi('2.6.B3')}
          {renderLi('2.6.B4')}
        </ul>
        {renderSubtitle('2.7')}
        {renderImg(img2_6_1, '2.7.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.7.B1')}
          {renderLi('2.7.B2')}
          {renderLi('2.7.B3')}
          {renderImg(img2_6_2)}
          {renderLi('2.7.B4')}
          {renderLi('2.7.B5')}
          {renderImg(img2_6_3, '2.7.Img2')}
          {renderLi('2.7.B6')}
          {renderLi('2.7.B7')}
        </ul>
        {renderSubtitle('2.7')}
        {renderImg(img2_7_1, '2.8.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('2.8.B1')}
          {renderLi('2.8.B2')}
          {renderImg(img2_7_2, '2.8.Img2')}
          {renderLi('2.8.B3')}
          {renderLi('2.8.B4')}
          {renderImg(img2_7_3, '2.8.Img3')}
          {renderLi('2.8.B5')}
        </ul>
      </div>
      <div className="page">
        {renderTitle('3')}
        {renderSubtitle('3.1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.1.B1')}
          {renderImg(img3_1_1, '3.1.Img1')}
          {renderLi('3.1.B2')}
          {renderImg(img3_1_2, '3.1.Img2')}
          {renderLi('3.1.B2.1')}
          {renderLi('3.1.B2.2')}
        </ul>
        {renderSubtitle('3.2')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.2.B1')}
          {renderImg(img3_2_1, '3.2.Img1')}
          {renderLi('3.2.B2')}
          {renderImg(img3_2_2, '3.2.Img2')}
          {renderLi('3.2.B3')}
          {renderLi('3.2.B4')}
          {renderLi('3.2.B5')}
        </ul>
        {renderSubtitle('3.3')}
        {renderImg(img3_3_1, '3.3.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.3.B1')}
          {renderLi('3.3.B2')}
          {renderLi('3.3.B3')}
          {renderLi('3.3.B4')}
        </ul>
        {renderSubtitle('3.4')}
        {renderImg(img3_4_1, '3.4.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.4.B1')}
          {renderLi('3.4.B2')}
          {renderImg(img3_4_2, '3.4.Img2')}
          {renderLi('3.4.B3')}
          {renderLi('3.4.B4')}
          {renderLi('3.4.B5')}
        </ul>
        {renderSubtitle('3.5')}
        {renderImg(img3_5_1, '3.5.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.5.B1')}
          {renderLi('3.5.B2')}
          {renderLi('3.5.B3')}
          {renderLi('3.5.B4')}
        </ul>
        {renderSubtitle('3.6')}
        {renderImg(img3_6_1, '3.6.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.6.B1')}
          {renderLi('3.6.B2')}
        </ul>
        {renderSubtitle('3.7')}
        {renderImg(img3_7_1, '3.7.Img1')}
        {renderSentence('Steps')}
        <ul>
          {renderLi('3.7.B1')}
          {renderLi('3.7.B2')}
          {renderLi('3.7.B3')}
          {renderLi('3.7.B4')}
        </ul>
      </div>
    </>
  );
})

export default Content;
