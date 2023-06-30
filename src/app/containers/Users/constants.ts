

export const Gender = ['OTHER', 'MALE', 'FEMALE'];

export const Active = ['ACTIVE', 'DEACTIVATED'];
export const Roles = ['SALE_ADMIN', 'IT_ADMIN', 'SALE', 'ADMIN', 'PORTAL_ADMIN'];
export const RolesApprove = ['IT_ADMIN', 'ADMIN', 'PORTAL_ADMIN'];


// ORDER
export const ORDER_LIST_VIEW = 'ORDER_LIST_VIEW';
export const ORDER_CREATE = 'ORDER_CREATE';
export const ORDER_EDIT = 'ORDER_EDIT';
export const ORDER_DELETE = 'ORDER_DELETE';
export const ORDER_APPROVE = 'ORDER_APPROVE';
export const ORDER_EXTEND = 'ORDER_EXTEND';
export const ORDER_RENEW = 'ORDER_RENEW'
// PRODUCT
export const PRODUCT_LIST_VIEW = 'PRODUCT_LIST_VIEW';
export const PRODUCT_CREATE = 'PRODUCT_CREATE';
export const PRODUCT_EDIT = 'PRODUCT_EDIT';
export const PRODUCT_DELETE = 'PRODUCT_DELETE';

// USER
export const USER_LIST_VIEW = 'USER_LIST_VIEW';
export const USER_CREATE = 'USER_CREATE';
export const USER_EDIT = 'USER_EDIT';
export const USER_DELETE = 'USER_DELETE';

export const isAllowed = (role) => {
  let permissions: any = []
  try {
    if (role?.toUpperCase() === 'SALE_ADMIN') {
      return permissions = [
        ORDER_LIST_VIEW,
        ORDER_CREATE,
        ORDER_EDIT,
        ORDER_DELETE,
        ORDER_EXTEND,
        ORDER_RENEW,
        PRODUCT_LIST_VIEW,
        PRODUCT_CREATE,
        PRODUCT_EDIT,
        PRODUCT_DELETE,
        USER_LIST_VIEW,
        USER_CREATE,
        USER_EDIT,
        USER_DELETE
      ]

    } else if (role?.toUpperCase() === 'PORTAL_ADMIN' || role?.toUpperCase() === 'ADMIN') {
      return permissions = [
        ORDER_LIST_VIEW,
        ORDER_CREATE,
        ORDER_EDIT,
        ORDER_DELETE,
        ORDER_APPROVE,
        ORDER_EXTEND,
        ORDER_RENEW,
        PRODUCT_LIST_VIEW,
        PRODUCT_CREATE,
        PRODUCT_EDIT,
        PRODUCT_DELETE,
        USER_LIST_VIEW,
        USER_CREATE,
        USER_EDIT,
        USER_DELETE,
      ]
    }
    else if (role.toUpperCase() === 'IT_ADMIN') {
      permissions = [
        ORDER_LIST_VIEW,
        ORDER_APPROVE,
        PRODUCT_LIST_VIEW,
        USER_LIST_VIEW,
      ]
      return permissions
    }
    return permissions
  } catch (error) {
    return permissions
  }
}

export const Status = {
  true: { text: 'ACTIVE', status: 'Success' },
  false: { text: 'DEACTIVATED', status: 'Warning' },
};

export const MODE_CREATE = 'CREATE';
export const MODE_UPDATE = 'UPDATE';
export const MODE_EDIT = 'EDIT';
export const MODE_EXTEND = 'EXTEND';
export const MODE_RENEW = 'RENEW';
