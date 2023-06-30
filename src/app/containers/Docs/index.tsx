import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import Layout from './Layout';
import './style.less';

export default function Docs() {
  useEffect(() => {
    if (window.location.hash) window.location.href = window.location.hash;
    else window.scrollTo(0, 0);
  }, []);

  return (
    <Switch>
      <Route exact path="" component={Layout}></Route>
    </Switch>
  );
}
