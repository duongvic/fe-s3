import { selectAccount } from 'app/containers/Auth/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

interface Props {
  twoFactor?: boolean;
  children: any;
  path: any;
  exact?: any;
}

const AuthRoute = (props: Props) => {
  const account = useSelector(selectAccount);
  const { children, twoFactor, ...rest } = props;
  if (props.hasOwnProperty('twoFactor')) {
    return (
      <Route
        {...rest}
        render={() =>
          account && twoFactor ? (
            children
          ) : (
            <Redirect to="/profile#security_option" />
          )
        }
      />
    );
  } else
    return (
      <Route
        {...rest}
        render={() => (account ? children : <Redirect to="/sign-in" />)}
      />
    );
};

export default AuthRoute;
