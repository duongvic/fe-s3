import { selectAccountInfo,selectAccount } from 'app/containers/Auth/selectors';
import ModalCheckTwoFactor from 'app/containers/Home/Landing/ModalCheckTwoFactor';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';

interface Props {
  children: any;
  path: any;
  exact?: any;
  requireTwoFactor: boolean;
}

export default function CheckTwoFactorRoute(props: Props) {
  const { children, requireTwoFactor, ...rest } = props;
  const [visible, setVisible] = useState(true);
  // const accountInfo = useSelector(selectAccountInfo);
  const account = useSelector(selectAccount);

  const filterRender = () => {
    // if (requireTwoFactor && accountInfo && !accountInfo?.enable_two_factor) {
    if (requireTwoFactor && account && !account?.enable_two_factors) {
      return (
        <ModalCheckTwoFactor
          visible={visible}
          setVisible={value => setVisible(value)}
        />
      );
    }
    return children;
  };

  return <Route {...rest} render={filterRender} />;
}
