import React from 'react';
import Iframe from 'react-iframe';
import { useSelector } from 'react-redux';
import { selectConsole } from '../selector';

export default function Console() {
  const consoleRedux = useSelector(selectConsole);

  return (
    <div>
      <Iframe
        url={
          consoleRedux
            ? consoleRedux?.url.replace(
                'https://hn.fptcompute.com.vn:13080',
                'https://webconsole-hn.fptvds.vn',
              )
            : ''
        }
        width="100%"
        height="800px"
        id="vncID"
        display="block"
        position="relative"
      />
    </div>
  );
}
