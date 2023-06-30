const root = '/dashboard';

const orders_local_path = `${root}/orders`;
const instances_local_path = `${root}/instances`;
const users_local_path = `${root}/users`;
const profile_local_path = `${root}/profile`;

export const localPath = {
  dashboard: `${root}`,
  orders: {
    orders: `${orders_local_path}`,
    order: `${orders_local_path}/:orderId`,
    create: `${orders_local_path}/create`,
    renew: `${orders_local_path}/renew/:orderId`,
    extend: `${orders_local_path}/extend/:orderId`,
    upgrade: `${orders_local_path}/upgrade/:orderId`,
  },
  instances: {
    instances: `${instances_local_path}`,
    instance: `${instances_local_path}/:instanceId`,
    create: `${instances_local_path}/create`,
  },
  users: {
    user: `${users_local_path}/:username`,
  },
  profile: {
    profile: `${profile_local_path}`,
    security_option: `${profile_local_path}#security_option`,
  },
};
