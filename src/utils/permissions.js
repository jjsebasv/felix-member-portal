export const roles = ['CX', 'Fraud Ops', 'Compliance', 'Credit Ops', 'Admin'];

const actionMatrix = {
  refund: ['CX', 'Admin'],
  markFraud: ['Fraud Ops', 'Admin'],
  unmarkFraud: ['Fraud Ops', 'Admin'],
  applyHold: ['Compliance', 'Fraud Ops', 'Admin'],
  releaseHold: ['Compliance', 'Admin'],
  escalate: ['Fraud Ops', 'Compliance', 'Admin'],
  markSuspicious: ['Fraud Ops', 'Compliance', 'Admin'],
  viewComplianceDetails: ['Compliance', 'Admin'],
  viewCreditActions: ['Credit Ops', 'Admin'],
  bulkOperationalActions: ['Admin', 'Compliance'],
};

export function can(role, action) {
  return actionMatrix[action]?.includes(role) ?? false;
}

export function allowedActions(role) {
  return Object.keys(actionMatrix).filter((action) => can(role, action));
}
