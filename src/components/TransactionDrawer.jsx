import Badge from './Badge';
import { can } from '../utils/permissions';

function actionList(role, txn) {
  const actions = [
    { id: 'refund', label: 'Refund', show: can(role, 'refund') },
    { id: 'applyHold', label: 'Apply Hold', show: can(role, 'applyHold') },
    { id: 'releaseHold', label: 'Release Hold', show: can(role, 'releaseHold') },
    { id: 'markSuspicious', label: 'Mark Suspicious', show: can(role, 'markSuspicious') },
    { id: 'escalate', label: 'Escalate', show: can(role, 'escalate') },
  ];

  return actions.map((a) => ({ ...a, disabled: a.id === 'releaseHold' && txn.holdStatus !== 'On Hold' }));
}

export default function TransactionDrawer({ transaction, role, onClose }) {
  if (!transaction) return null;
  const canViewSensitive = can(role, 'viewComplianceDetails') || role === 'Fraud Ops';

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-[460px] border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Transaction Detail</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{transaction.id}</h3>
          </div>
          <button onClick={onClose} className="rounded-md border border-slate-200 px-2 py-1 text-sm hover:bg-slate-50">
            Close
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-slate-500">Amount</p>
              <p className="font-semibold">${transaction.amount.toLocaleString('en-US')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Date / Time</p>
              <p className="font-semibold">{transaction.date.replace('T', ' ')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Sender</p>
              <p className="font-semibold">{transaction.sender}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Recipient</p>
              <p className="font-semibold">{transaction.recipient}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Destination Country</p>
              <p className="font-semibold">{transaction.destination}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Processor Ref</p>
              <p className="font-semibold">{canViewSensitive ? transaction.processorRef : 'Restricted'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge value={transaction.status} />
            <Badge value={transaction.holdStatus} />
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
              Fraud {transaction.fraudScore}
            </span>
          </div>

          {transaction.holdStatus === 'On Hold' && (
            <div className="rounded-md border border-violet-200 bg-violet-50 p-3">
              <p className="text-xs font-semibold uppercase text-violet-800">Hold Summary</p>
              <p className="mt-2">
                <span className="font-semibold">Reason:</span> {transaction.holdReason}
              </p>
              <p>
                <span className="font-semibold">Owner:</span> {transaction.holdOwner}
              </p>
              <p>
                <span className="font-semibold">Triggered by:</span>{' '}
                {canViewSensitive ? transaction.holdTriggeredBy : 'Restricted'}
              </p>
              <p className="mt-2 text-xs text-violet-900">
                <span className="font-semibold">Required next step:</span> {transaction.nextStep}
              </p>
            </div>
          )}

          <div className="rounded-md border border-slate-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Timeline</p>
            <ul className="space-y-1 text-sm text-slate-700">
              {transaction.timeline.map((event) => (
                <li key={event} className="rounded-sm bg-slate-50 px-2 py-1">
                  {event}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">External Links</p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">
                Open in Payment Processor
              </a>
              <a href="#" className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">
                Open in Fraud Vendor
              </a>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {actionList(role, transaction)
                .filter((item) => item.show)
                .map((item) => (
                  <button
                    key={item.id}
                    disabled={item.disabled}
                    className="rounded-md border border-slate-300 px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
