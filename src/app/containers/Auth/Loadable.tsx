import { Loadable } from 'utils/loadable';

export const SignIn = Loadable(() => import('./SignIn'));
export const SignUp = Loadable(() => import('./SignUp'));
export const ForgotPassword = Loadable(() => import('./ForgotPassword'));
export const RecoveryPassword = Loadable(() => import('./RecoveryPassword'));
export const ForgotQRCode = Loadable(() => import('./ForgotQRCode'));
export const RecoveryQRCode = Loadable(() => import('./RecoveryQRCode'));
