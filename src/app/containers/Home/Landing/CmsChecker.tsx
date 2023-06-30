import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { cmsSaga } from '../saga';
import {
  selectBanners,
  selectContacts,
  selectMetas,
  selectNavbars,
  selectCustomers,
  selectFeatures,
  selectBenefitServices,
  selectDesServices,
} from '../selectors';
import { actions, reducer, sliceKey } from '../slice';
export default function CmsChecker() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: cmsSaga });

  const dispatch = useDispatch();
  // const location = useLocation();

  // console.log(location);

  const metas = useSelector(selectMetas);
  const navbars = useSelector(selectNavbars);
  const banners = useSelector(selectBanners);
  const contacts = useSelector(selectContacts);
  const customers = useSelector(selectCustomers);
  const features = useSelector(selectFeatures);
  const desServices = useSelector(selectDesServices);
  const benefitServices = useSelector(selectBenefitServices);

  useEffect(() => {
    if (!metas) dispatch(actions.getMetas());
    if (!navbars) dispatch(actions.getNavbars());
    if (!contacts) dispatch(actions.getContacts());
  }, [dispatch]);

  useEffect(() => {
    if (window.location.pathname === '/') {
      if (!banners) dispatch(actions.getBanners());
      if (!customers) dispatch(actions.getCustomers());
      if (!features) dispatch(actions.getFeatures());
      if (!desServices) dispatch(actions.getDesServices());
      if (!benefitServices) dispatch(actions.getBenefitServices());
    }
  }, [dispatch]);
  return <></>;
}
