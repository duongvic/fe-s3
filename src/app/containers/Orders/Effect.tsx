import React from 'react';
import TweenOne from 'rc-tween-one';

export function Effect(props) {
  return (
    <TweenOne
      key={0}
      animation={{
        opacity: 1,
        scale: 1,
      }}
      style={{
        height: '100%',
        opacity: 0,
        transform: 'scale(0.5, 1)',
      }}
    >
      {props.children}
    </TweenOne>
  );
}
