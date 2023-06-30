// import { ordersSaga } from 'app/containers/Orders/saga';
// import { reducer, sliceKey } from 'app/containers/Orders/slice';
// import React from 'react';
// import { useInjectReducer, useInjectSaga } from 'redux-injectors';
// import { LandingPage } from './Landing';
// import LandingBase from './Landing/LandingBase';

// export default function Landing() {
//   useInjectReducer({ key: sliceKey, reducer: reducer });
//   useInjectSaga({ key: sliceKey, saga: ordersSaga });

//   return (
//     <LandingBase>
//       <LandingPage />
//     </LandingBase>
//   );
// }

import { ordersSaga } from 'app/containers/Orders/saga';
import { reducer, sliceKey } from 'app/containers/Orders/slice';
import React from 'react';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import SignIn from '../Auth/SignIn';

export default function Landing() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: ordersSaga });

  return <SignIn />;
}
