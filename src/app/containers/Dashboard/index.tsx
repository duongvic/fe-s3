import { Breadcrumb, ConfigProvider, Layout } from 'antd';
import enEN from 'antd/lib/locale/en_US';
import CheckTwoFactorRoute from 'app/components/CheckTwoFactorRoute';
import { NotFoundPage } from 'app/components/NotFoundPage/Loadable';
import { dashboardRoutes } from 'app/routes/route.dashboard';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import { capitalizeText } from 'utils/common';
import { selectAccount } from '../Auth/selectors';
import AppBar from './AppBar';
import SiderBar from './SiderBar';
// import DataviewInstances from '../Compute/Instances/DataviewInstances';
import './styles.less';
import DataviewOrders from '../Orders/DataviewOrders';

const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const match = useRouteMatch();
  const { pathname } = useLocation();

  const account = useSelector(selectAccount);

  const breadCrumb = (
    <Breadcrumb style={{ margin: '16px 0 0 16px' }}>
      {pathname &&
        pathname
          ?.split('/')
          ?.slice(1)
          ?.map(name => (
            <Breadcrumb.Item key={name}>{capitalizeText(name)}</Breadcrumb.Item>
          ))}
    </Breadcrumb>
  );
  //Switch Route in Dashboard
  const switchRoutes = (
    <Switch>
      <CheckTwoFactorRoute requireTwoFactor={true} exact path={match.url}>
        <div style={{ padding: 24, minHeight: 360 }}>
          {/* <DataviewInstances /> */}
          <DataviewOrders />
        </div>
      </CheckTwoFactorRoute>
      {dashboardRoutes.map(prop =>
        prop.children.map((chil, key) =>
          chil.role.some(
            element => element === account?.role?.toUpperCase(),
          ) ? (
            <CheckTwoFactorRoute
              requireTwoFactor={chil.requireTwoFactor}
              key={key}
              path={`${match.url}${chil.path}`}
            >
              <div style={{ padding: 24, minHeight: 360 }}>
                {chil.component}
              </div>
            </CheckTwoFactorRoute>
          ) : (
            <Route
              key={key}
              path={`${match.url}${chil.path}`}
              render={() => <NotFoundPage />}
            />
          ),
        ),
      )}
      <Route component={NotFoundPage} />
    </Switch>
  );

  //Handle collapse sider left
  const onCollapse = collapsed => setCollapsed(collapsed);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Helmet>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          className="sider"
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          collapsedWidth={90}
        >
          <SiderBar />
        </Sider>

        <Layout
          className="site-layout"
          style={{ marginLeft: collapsed ? 90 : 200 }}
        >
          <Header className="header" style={{ padding: 0 }}>
            <AppBar />
          </Header>
          <Content>
            {breadCrumb}
            <ConfigProvider locale={enEN}>{switchRoutes}</ConfigProvider>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Copyright © 2022 TNHH MTV viễn thông quốc tế FPT
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
