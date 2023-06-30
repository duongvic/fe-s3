import { Loadable } from 'utils/loadable';

export const Landing = Loadable(() => import('./index'));
export const Profile = Loadable(() => import('./Profile/index'));
export const News = Loadable(() => import('./News/index'));
