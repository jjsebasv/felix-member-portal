const items = [
  'Customer Search',
  'Bulk Actions',
  'Global Audit Trail',
  'Product / Growth Tools',
  'Roles & Permissions',
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
      <div className="border-b border-slate-700 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Internal Ops</p>
        <h1 className="mt-1 text-lg font-semibold">Félix Member Portal</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = currentPage === item;
          return (
            <button
              key={item}
              onClick={() => onNavigate(item)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-700 px-4 py-3 text-xs text-slate-400">
        Aggregated operational data only. External systems remain source of record.
      </div>
    </aside>
  );
}
