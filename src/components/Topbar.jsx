import { useState } from 'react';
import { roles } from '../utils/permissions';

export default function Topbar({ title, role, onRoleChange, agent }) {
  const [openUserMenu, setOpenUserMenu] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Operations Workspace</p>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
          <label className="mr-2 text-xs font-semibold uppercase text-slate-500">Demo Role</label>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="text-sm font-medium text-slate-800 outline-none"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenUserMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {agent.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
            <span className="font-medium text-slate-800">{agent.name}</span>
          </button>

          {openUserMenu && (
            <div className="absolute right-0 top-12 z-30 w-72 rounded-md border border-slate-200 bg-white p-4 shadow-panel">
              <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
              <p className="mt-1 text-xs text-slate-500">{agent.email}</p>
              <div className="mt-3 border-t border-slate-100 pt-3 text-sm">
                <p>
                  <span className="font-semibold text-slate-700">Current role:</span> {role}
                </p>
                <p className="mt-2 font-semibold text-slate-700">Groups</p>
                <ul className="mt-1 list-disc pl-5 text-slate-600">
                  {agent.groups.map((group) => (
                    <li key={group}>{group}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
