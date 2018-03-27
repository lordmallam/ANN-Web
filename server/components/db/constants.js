export const DB_VIEWS = {
  member: {
    byEmail: 'member/by-email',
    byActivationCode: 'member/by-activation-code',
    byId: 'member/by-id',
    all: 'member/all'
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
  }
};

export const DOC_TYPES = {
  member: 'member',
  state: 'state',
  lga: 'lga',
  prospect: 'prospect'
};
