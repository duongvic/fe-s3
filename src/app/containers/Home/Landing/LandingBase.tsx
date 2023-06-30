import { PhoneFilled } from '@ant-design/icons';
import { Affix, Button, Layout } from 'antd';
import ButtonBackTop from 'app/components/ButtonBackTop';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectContacts } from '../selectors';
import CmsChecker from './CmsChecker';
import Footer1 from './Footer1';
import './less/index.less';
import Navbar from './Navbar';
import SiderBar from './SiderBar';

export default function LandingBase({ children }) {
  const contacts = useSelector(selectContacts);

  return (
    <>
      <CmsChecker />
      <Navbar />
      <Layout>
        <Layout.Content>
          <Affix className="sider-landing" offsetTop={6}>
            <Layout.Sider breakpoint="lg" collapsedWidth="0">
              <SiderBar></SiderBar>
            </Layout.Sider>
          </Affix>
          {children}
        </Layout.Content>
      </Layout>
      <Footer1 id="Footer1_0" key="Footer1_0" />
      <ButtonBackTop />
      <Button
        type="link"
        shape="round"
        icon={<PhoneFilled />}
        href={`tel:${contacts?.phone}`}
        className="phone-button"
      ></Button>
    </>
  );
}
