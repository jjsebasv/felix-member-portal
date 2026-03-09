const styleMap = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Clear: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  'Under Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'Needs Documents': 'bg-amber-100 text-amber-700 border-amber-200',
  'Medium Risk': 'bg-amber-100 text-amber-700 border-amber-200',
  Restricted: 'bg-orange-100 text-orange-700 border-orange-200',
  Suspended: 'bg-rose-100 text-rose-700 border-rose-200',
  Failed: 'bg-rose-100 text-rose-700 border-rose-200',
  Flagged: 'bg-rose-100 text-rose-700 border-rose-200',
  'High Risk': 'bg-rose-100 text-rose-700 border-rose-200',
  'On Hold': 'bg-violet-100 text-violet-700 border-violet-200',
  Refunded: 'bg-sky-100 text-sky-700 border-sky-200',
  Released: 'bg-slate-100 text-slate-700 border-slate-200',
  None: 'bg-slate-100 text-slate-600 border-slate-200',
  Overdue: 'bg-rose-100 text-rose-700 border-rose-200',
  'Due Soon': 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function Badge({ value }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
        styleMap[value] ?? 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {value}
    </span>
  );
}
