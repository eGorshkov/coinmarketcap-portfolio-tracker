export default function getUserRights(userData) {
  return {
    actives: {
      canView: !!userData?.id,
    },
    portfolios: {
      canAdd: !!userData?.id,
      canUpdate: !!userData?.id,
    },
    transactions: {
      canAdd: !!userData?.id,
      canDelete: !!userData?.id,
      canUpdate: !!userData?.id,
    },
  };
}
