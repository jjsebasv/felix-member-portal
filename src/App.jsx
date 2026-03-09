import { useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Badge from './components/Badge';
import TransactionDrawer from './components/TransactionDrawer';
import {
  agents,
  bulkActions,
  creditByCustomer,
  customerAuditLogs,
  customers,
  groups,
  remittances,
  walletByCustomer,
} from './data/mockData';
import { can } from './utils/permissions';

const customerTabs = ['Remittances', 'Wallet', 'Credit', 'Customer Logs'];

function Card({ title, value, secondary }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
      {secondary && <p className="mt-1 text-xs text-slate-500">{secondary}</p>}
    </div>
  );
}

function TableHeader({ columns }) {
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
        {columns.map((col) => (
          <th key={col} className="px-3 py-2 font-semibold">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function SearchPage({ query, setQuery, filteredCustomers, onSelectCustomer }) {
  return (
    <section className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Search by name, email, phone, customer ID, transaction ID
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: Ana Torres, CUS-10042, TX-772201, +1 (305)..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-100 focus:ring"
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <table className="w-full table-auto">
          <TableHeader
            columns={[
              'Customer Name',
              'Email',
              'Phone',
              'Customer Status',
              'Fraud Status',
              'Most Recent Transaction',
            ]}
          />
          <tbody className="text-sm">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                onClick={() => onSelectCustomer(customer.id)}
              >
                <td className="px-3 py-3">
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="text-xs text-slate-500">{customer.id}</p>
                </td>
                <td className="px-3 py-3 text-slate-700">{customer.email}</td>
                <td className="px-3 py-3 text-slate-700">{customer.phone}</td>
                <td className="px-3 py-3">
                  <Badge value={customer.status} />
                </td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2">
                    <Badge value={customer.fraudStatus} />
                    <span className="text-xs text-slate-500">{customer.fraudScore}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700">{customer.recentTxnDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">No customer results for the current query.</div>
        )}
      </div>
    </section>
  );
}

function CustomerProfile({ customer, role, selectedTab, setSelectedTab, onSelectTransaction, onAction }) {
  const customerRemits = remittances.filter((tx) => tx.customerId === customer.id);
  const wallet = walletByCustomer[customer.id];
  const credit = creditByCustomer[customer.id];
  const customerLogs = customerAuditLogs.filter((log) => log.customerId === customer.id);
  const [sourceFilter, setSourceFilter] = useState('All');

  const quickActions = [
    { id: 'refund', label: 'Refund transaction', visible: can(role, 'refund') },
    { id: 'markFraud', label: 'Mark customer as fraud', visible: can(role, 'markFraud') },
    { id: 'unmarkFraud', label: 'Remove fraud flag', visible: can(role, 'unmarkFraud') },
    { id: 'applyHold', label: 'Apply hold', visible: can(role, 'applyHold') },
    { id: 'releaseHold', label: 'Release hold', visible: can(role, 'releaseHold') },
  ];

  const filteredLogs = customerLogs.filter((log) => sourceFilter === 'All' || log.sourceType === sourceFilter);
  const restrictedContact = role === 'Fraud Ops';
  const showComplianceDetails = can(role, 'viewComplianceDetails');

  return (
    <section className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold text-slate-900">{customer.name}</h3>
              <Badge value={customer.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {customer.id} · {restrictedContact ? 'restricted@email.com' : customer.email} ·{' '}
              {restrictedContact ? '(***) ***-****' : customer.phone}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">Fraud Score {customer.fraudScore}</span>
              <Badge value={customer.fraudStatus} />
              <Badge value={customer.kycStatus} />
              <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                Products: {customer.products.join(' / ')}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <a
              href={customer.zendeskUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Open in Zendesk
            </a>
            <div className="grid w-full grid-cols-1 gap-2">
              {quickActions.some((action) => action.visible) ? (
                quickActions
                  .filter((action) => action.visible)
                  .map((action) => (
                    <button
                      key={action.id}
                      onClick={() => onAction(action.label)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      {action.label}
                    </button>
                  ))
              ) : (
                <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  No quick actions available for {role}.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-3">
          <Card title="Account Status" value={customer.status} />
          <Card title="Fraud Status" value={customer.fraudStatus} secondary={`Score ${customer.fraudScore}`} />
          <Card title="KYC" value={customer.kycStatus} />
          <Card title="Latest Transaction" value={customer.recentTxnDate} />
          <Card title="Owned Products" value={customer.products.length} secondary={customer.products.join(', ')} />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_260px] gap-4">
        <div className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 pt-3">
            <div className="flex gap-1">
              {customerTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`rounded-t-md px-3 py-2 text-sm font-medium ${
                    selectedTab === tab
                      ? 'border border-b-white border-slate-200 bg-white text-slate-900'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {selectedTab === 'Remittances' && (
              <div className="rounded-md border border-slate-200">
                <table className="w-full table-auto">
                  <TableHeader
                    columns={[
                      'Transaction ID',
                      'Date',
                      'Amount',
                      'Destination',
                      'Status',
                      'Fraud Score',
                      'Hold Status',
                    ]}
                  />
                  <tbody className="text-sm">
                    {customerRemits.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-3 py-3 font-medium text-slate-900">{tx.id}</td>
                        <td className="px-3 py-3">{tx.date.replace('T', ' ')}</td>
                        <td className="px-3 py-3">${tx.amount.toLocaleString('en-US')}</td>
                        <td className="px-3 py-3">{tx.destination}</td>
                        <td className="px-3 py-3">
                          <Badge value={tx.status} />
                        </td>
                        <td className="px-3 py-3">{tx.fraudScore}</td>
                        <td className="px-3 py-3">
                          <Badge value={tx.holdStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {customerRemits.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-500">No remittance records available.</div>
                )}
              </div>
            )}

            {selectedTab === 'Wallet' && (
              <div className="space-y-4">
                {wallet ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Card title="Current Balance" value={`$${wallet.balance.toLocaleString('en-US')}`} />
                      <Card title="Restrictions" value={wallet.restrictions.length} secondary={wallet.restrictions.join(' · ')} />
                    </div>
                    <div className="rounded-md border border-slate-200">
                      <table className="w-full table-auto">
                        <TableHeader columns={['Event ID', 'Date', 'Type', 'Amount', 'Status']} />
                        <tbody className="text-sm">
                          {wallet.transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-3 py-3 font-medium">{tx.id}</td>
                              <td className="px-3 py-3">{tx.date}</td>
                              <td className="px-3 py-3">{tx.type}</td>
                              <td className="px-3 py-3">${tx.amount.toLocaleString('en-US')}</td>
                              <td className="px-3 py-3">
                                <Badge value={tx.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                    No wallet data for this customer.
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'Credit' && (
              <div className="space-y-4">
                {credit ? (
                  <>
                    <div className="grid grid-cols-4 gap-3">
                      <Card title="Credit Limit" value={`$${credit.creditLimit.toLocaleString('en-US')}`} />
                      <Card title="Outstanding" value={`$${credit.outstanding.toLocaleString('en-US')}`} />
                      <Card title="Repayment Status" value={credit.repaymentStatus} />
                      <Card title="Next Payment" value={credit.nextPaymentDate} />
                    </div>
                    <div className="rounded-md border border-slate-200">
                      <table className="w-full table-auto">
                        <TableHeader columns={['Loan ID', 'Opened', 'Principal', 'APR', 'Status']} />
                        <tbody className="text-sm">
                          {credit.loans.map((loan) => (
                            <tr key={loan.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-3 py-3 font-medium">{loan.id}</td>
                              <td className="px-3 py-3">{loan.openedAt}</td>
                              <td className="px-3 py-3">${loan.principal.toLocaleString('en-US')}</td>
                              <td className="px-3 py-3">{loan.apr}</td>
                              <td className="px-3 py-3">
                                <Badge value={loan.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-md border border-slate-200">
                      <table className="w-full table-auto">
                        <TableHeader columns={['Event', 'Date', 'Amount']} />
                        <tbody className="text-sm">
                          {credit.events.map((event) => (
                            <tr key={event.id} className="border-b border-slate-100">
                              <td className="px-3 py-3">{event.event}</td>
                              <td className="px-3 py-3">{event.date}</td>
                              <td className="px-3 py-3">${event.amount.toLocaleString('en-US')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {!can(role, 'viewCreditActions') && (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        Credit action controls are restricted for {role}.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                    No credit data for this customer.
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'Customer Logs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
                  <p className="text-sm font-medium text-slate-700">Customer-level audit trail</p>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
                  >
                    {['All', 'Agent', 'System', 'Customer', 'Third Party'].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-md border border-slate-200">
                  <table className="w-full table-auto">
                    <TableHeader columns={['Timestamp', 'Action', 'Entity', 'Source Type', 'Source Actor', 'Notes']} />
                    <tbody className="text-sm">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-100">
                          <td className="px-3 py-3">{log.timestamp}</td>
                          <td className="px-3 py-3 font-medium">{log.action}</td>
                          <td className="px-3 py-3">{log.entity}</td>
                          <td className="px-3 py-3">
                            <Badge value={log.sourceType} />
                          </td>
                          <td className="px-3 py-3">{log.sourceActor}</td>
                          <td className="px-3 py-3 text-slate-600">{log.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Required Actions</p>
            {customer.requiredActions.length ? (
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {customer.requiredActions.map((action) => (
                  <li key={action} className="rounded-md border border-amber-200 bg-amber-50 px-2 py-2">
                    {action}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No required actions.</p>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">External Tools</p>
            <div className="mt-2 space-y-2 text-sm">
              <a
                href="#"
                onClick={(e) => {
                  if (!showComplianceDetails) e.preventDefault();
                }}
                className={`block rounded-md border border-slate-200 px-2 py-1 ${
                  showComplianceDetails ? 'hover:bg-slate-50' : 'cursor-not-allowed bg-slate-50 text-slate-400'
                }`}
              >
                Open in KYC Provider
              </a>
              <a href="#" className="block rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">
                Open in Fraud Vendor
              </a>
              <a href="#" className="block rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">
                Open in Payment Processor
              </a>
            </div>
            {!showComplianceDetails && (
              <p className="mt-2 text-xs text-slate-500">Compliance notes are restricted for {role}.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GlobalAuditPage() {
  const [filters, setFilters] = useState({
    agent: '',
    customer: '',
    action: '',
    product: '',
    sourceType: '',
    from: '',
    to: '',
  });

  const rows = useMemo(
    () =>
      customerAuditLogs.filter((row) => {
        if (filters.agent && !row.sourceActor.toLowerCase().includes(filters.agent.toLowerCase())) return false;
        if (filters.customer && !row.customerId.toLowerCase().includes(filters.customer.toLowerCase())) return false;
        if (filters.action && !row.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
        if (filters.product && row.product !== filters.product) return false;
        if (filters.sourceType && row.sourceType !== filters.sourceType) return false;
        if (filters.from && row.timestamp.slice(0, 10) < filters.from) return false;
        if (filters.to && row.timestamp.slice(0, 10) > filters.to) return false;
        return true;
      }),
    [filters]
  );

  return (
    <section className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-slate-800">Filters</p>
        <div className="grid grid-cols-7 gap-2">
          <input
            placeholder="Agent"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={filters.agent}
            onChange={(e) => setFilters((p) => ({ ...p, agent: e.target.value }))}
          />
          <input
            placeholder="Customer"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={filters.customer}
            onChange={(e) => setFilters((p) => ({ ...p, customer: e.target.value }))}
          />
          <input
            placeholder="Action Type"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={filters.action}
            onChange={(e) => setFilters((p) => ({ ...p, action: e.target.value }))}
          />
          <select
            value={filters.product}
            onChange={(e) => setFilters((p) => ({ ...p, product: e.target.value }))}
            className="rounded border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">Product</option>
            {['Remittance', 'Fraud', 'Compliance', 'Credit'].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={filters.sourceType}
            onChange={(e) => setFilters((p) => ({ ...p, sourceType: e.target.value }))}
            className="rounded border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">Source Type</option>
            {['Agent', 'System', 'Customer', 'Third Party'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={filters.from}
            onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
          />
          <input
            type="date"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={filters.to}
            onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        <table className="w-full table-auto">
          <TableHeader columns={['Timestamp', 'Customer', 'Action', 'Entity', 'Product', 'Source Type', 'Source Actor', 'Notes']} />
          <tbody className="text-sm">
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="px-3 py-3">{row.timestamp}</td>
                <td className="px-3 py-3">{row.customerId}</td>
                <td className="px-3 py-3 font-medium">{row.action}</td>
                <td className="px-3 py-3">{row.entity}</td>
                <td className="px-3 py-3">{row.product}</td>
                <td className="px-3 py-3">
                  <Badge value={row.sourceType} />
                </td>
                <td className="px-3 py-3">{row.sourceActor}</td>
                <td className="px-3 py-3 text-slate-600">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BulkActionsPage({ role, onAction }) {
  const [cohort, setCohort] = useState({ country: 'Mexico', risk: 'Low to Medium', product: 'Wallet' });
  const [selectedAction, setSelectedAction] = useState('Apply promotion');
  const selectedCount = 182;

  return (
    <section className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Cohort Builder</h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <select
            value={cohort.country}
            onChange={(e) => setCohort((p) => ({ ...p, country: e.target.value }))}
            className="rounded border border-slate-300 px-2 py-2 text-sm"
          >
            {['Mexico', 'Guatemala', 'Colombia', 'Peru', 'All LATAM'].map((opt) => (
              <option key={opt} value={opt}>
                Destination: {opt}
              </option>
            ))}
          </select>
          <select
            value={cohort.risk}
            onChange={(e) => setCohort((p) => ({ ...p, risk: e.target.value }))}
            className="rounded border border-slate-300 px-2 py-2 text-sm"
          >
            {['Low to Medium', 'High Risk', 'Flagged Only'].map((opt) => (
              <option key={opt} value={opt}>
                Risk: {opt}
              </option>
            ))}
          </select>
          <select
            value={cohort.product}
            onChange={(e) => setCohort((p) => ({ ...p, product: e.target.value }))}
            className="rounded border border-slate-300 px-2 py-2 text-sm"
          >
            {['Wallet', 'Remittance', 'Credit'].map((opt) => (
              <option key={opt} value={opt}>
                Product: {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Selected users</p>
            <p className="text-2xl font-semibold">{selectedCount}</p>
          </div>
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="rounded border border-slate-300 px-2 py-2 text-sm"
            >
              {bulkActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          This operation impacts many users. Confirmation is required.
        </div>

        <button
          disabled={!can(role, 'bulkOperationalActions')}
          onClick={() => onAction(`Bulk action: ${selectedAction}`)}
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Review and Confirm
        </button>
        {!can(role, 'bulkOperationalActions') && (
          <p className="mt-2 text-xs text-slate-500">Only Compliance/Admin can execute bulk operational actions.</p>
        )}
      </div>
    </section>
  );
}

function RolesPermissionsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);
  const [tab, setTab] = useState('Members');
  const group = groups.find((g) => g.id === selectedGroupId);

  return (
    <section className="grid grid-cols-[240px_1fr] gap-4">
      <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Groups</p>
        <div className="space-y-1">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`w-full rounded px-3 py-2 text-left text-sm ${
                g.id === selectedGroupId ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-50'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">{group.name}</h3>
        <div className="mt-3 flex gap-1 border-b border-slate-200">
          {['Members', 'Permissions', 'Visibility Rules'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t px-3 py-2 text-sm font-medium ${
                tab === t ? 'border border-b-white border-slate-200 bg-white' : 'text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'Members' && (
            <ul className="space-y-2 text-sm">
              {group.members.map((member) => (
                <li key={member} className="rounded border border-slate-200 px-3 py-2">
                  {member}
                </li>
              ))}
            </ul>
          )}

          {tab === 'Permissions' && (
            <ul className="space-y-2 text-sm">
              {group.permissions.map((permission) => (
                <li key={permission} className="rounded border border-slate-200 px-3 py-2">
                  {permission}
                </li>
              ))}
            </ul>
          )}

          {tab === 'Visibility Rules' && (
            <ul className="space-y-2 text-sm">
              {group.visibilityRules.map((rule) => (
                <li key={rule} className="rounded border border-slate-200 px-3 py-2">
                  {rule}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductGrowthToolsPage() {
  return (
    <section className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Product / Growth Tools</h3>
        <p className="mt-1 text-sm text-slate-600">
          Internal tooling launchpad for campaign ops, lifecycle tags, and experimentation queues.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { title: 'Campaign Targeting', desc: 'Build user cohorts with dynamic eligibility.' },
          { title: 'Lifecycle Tags', desc: 'Apply or remove behavioral tags in bulk.' },
          { title: 'Experiment Enrollment', desc: 'Assign customers to controlled rollouts.' },
        ].map((item) => (
          <div key={item.title} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConfirmationModal({ action, onClose }) {
  if (!action) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-5 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Confirm Sensitive Action</p>
        <h4 className="mt-2 text-lg font-semibold text-slate-900">{action}</h4>
        <p className="mt-2 text-sm text-slate-600">This is a mock confirmation step for controlled operational actions.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('Customer Search');
  const [role, setRole] = useState('CX');
  const [query, setQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Remittances');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const agent = useMemo(() => agents.find((a) => a.role === role) ?? agents[0], [role]);

  const txById = useMemo(() => Object.fromEntries(remittances.map((tx) => [tx.id.toLowerCase(), tx.customerId])), []);

  const filteredCustomers = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();

    return customers.filter((customer) => {
      const directMatch = [customer.name, customer.email, customer.phone, customer.id].some((field) =>
        field.toLowerCase().includes(q)
      );
      const txHit = remittances.some((tx) => tx.customerId === customer.id && tx.id.toLowerCase().includes(q));
      const mappedTx = txById[q] === customer.id;
      return directMatch || txHit || mappedTx;
    });
  }, [query, txById]);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const title = selectedCustomer && currentPage === 'Customer Search' ? `Customer Profile · ${selectedCustomer.name}` : currentPage;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page !== 'Customer Search') setSelectedCustomerId(null);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} role={role} onRoleChange={setRole} agent={agent} />

        <main className="flex-1 overflow-y-auto p-6">
          {currentPage === 'Customer Search' && !selectedCustomer && (
            <SearchPage
              query={query}
              setQuery={setQuery}
              filteredCustomers={filteredCustomers}
              onSelectCustomer={(id) => {
                setSelectedCustomerId(id);
                setSelectedTab('Remittances');
              }}
            />
          )}

          {currentPage === 'Customer Search' && selectedCustomer && (
            <CustomerProfile
              customer={selectedCustomer}
              role={role}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              onSelectTransaction={setSelectedTransaction}
              onAction={setPendingAction}
            />
          )}

          {currentPage === 'Global Audit Trail' && <GlobalAuditPage />}
          {currentPage === 'Bulk Actions' && <BulkActionsPage role={role} onAction={setPendingAction} />}
          {currentPage === 'Roles & Permissions' && <RolesPermissionsPage />}
          {currentPage === 'Product / Growth Tools' && <ProductGrowthToolsPage />}
        </main>
      </div>

      <TransactionDrawer transaction={selectedTransaction} role={role} onClose={() => setSelectedTransaction(null)} />
      <ConfirmationModal action={pendingAction} onClose={() => setPendingAction(null)} />
    </div>
  );
}
