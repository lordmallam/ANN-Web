export const DB_VIEWS = {
  member: {
    byEmail: 'member/by-email',
    byActivationCode: 'member/by-activation-code',
    byId: 'member/by-id',
    all: 'member/all',
    byMemberId: 'member/by-memberId'
  },
  state: {
    byName: 'state/by-name',
    all: 'state/all',
    byId: 'state/by-id'
  },
  lga: {
    byName: 'lga/by-name',
    all: 'lga/all',
    byId: 'lga/by-id',
    byState: 'lga/by-state'
  },
  prospect: {
    byId: 'prospect/by-id',
    byEmail: 'prospect/by-email'
  },
  user: {
    byMemberId: 'user/by-member-id'
  }
};

export const DOC_TYPES = {
  member: 'member',
  state: 'state',
  lga: 'lga',
  prospect: 'prospect'
};

export const PERMISSIONS = {
  admin: ['ums_permission_can_add_member', 'ums_permission_can_edit_member', 'ums_permission_can_delete_member',
    'ums_permission_can_add_prospect', 'ums_permission_can_edit_prospect', 'ums_permission_can_delete_prospect',
    'ums_permission_can_add_user', 'ums_permission_can_edit_user', 'ums_permission_can_delete_user'],
  agent: ['ums_permission_can_add_member', 'ums_permission_can_edit_member',
    'ums_permission_can_add_prospect', 'ums_permission_can_edit_prospect', 'ums_permission_can_delete_prospect'],
  member: ['ums_permission_can_add_member', 'ums_permission_can_edit_member', 'ums_permission_can_edit_user']
};
