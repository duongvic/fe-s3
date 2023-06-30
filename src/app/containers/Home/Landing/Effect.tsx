import { OverPack } from 'rc-scroll-anim';
import TweenOne from 'rc-tween-one';
import React from 'react';

interface props {
  location?: any;
  children: any;
}

export default function Effect({ location, children }: props) {
  const setting = {
    always: false,
    replay: false,
  };
  return (
    <OverPack playScale={location ? location : 0.2} {...setting}>
      <TweenOne
        key="0"
        animation={{ opacity: 1, scale: 1 }}
        style={{ opacity: 0, transform: 'scale(0.5,1)' }}
      >
        {children}
      </TweenOne>
    </OverPack>
  );
}
