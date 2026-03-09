const state = {
  selectedCaseId: null,
  query: "",
  team: "all",
  priority: "all",
};

const data = {
  cases: [
    {
      id: "C-10071",
      customerId: "U-8841",
      customerName: "Ana Torres",
      team: "CX",
      status: "Waiting on Compliance",
      priority: "P1",
      slaMinutes: 42,
      medianTtrMinutes: 97,
    },
    {
      id: "C-10072",
      customerId: "U-6640",
      customerName: "Luis Mendoza",
      team: "Fraud",
      status: "Investigating",
      priority: "P0",
      slaMinutes: 18,
      medianTtrMinutes: 83,
    },
    {
      id: "C-10073",
      customerId: "U-9912",
      customerName: "Sofia Delgado",
      team: "Compliance",
      status: "Docs Requested",
      priority: "P1",
      slaMinutes: 73,
      medianTtrMinutes: 126,
    },
    {
      id: "C-10074",
      customerId: "U-5114",
      customerName: "Ernesto Ruiz",
      team: "Credit",
      status: "Manual Review",
      priority: "P2",
      slaMinutes: 150,
      medianTtrMinutes: 140,
    },
    {
      id: "C-10075",
      customerId: "U-7742",
      customerName: "Maribel Flores",
      team: "CX",
      status: "Ready to Resolve",
      priority: "P2",
      slaMinutes: 95,
      medianTtrMinutes: 58,
    },
  ],
  customers: {
    "U-8841": {
      id: "U-8841",
      name: "Ana Torres",
      phone: "+1 (214) 555-8102",
      country: "US -> Mexico",
      fraudScore: 38,
      holdReason: "Enhanced KYC required",
      kycStatus: "Pending",
      walletBalance: "$482.33",
      loanState: "Current (2/8 paid)",
      remittanceCount30d: 7,
      openCases: 1,
      resolvedCases90d: 4,
      lastContact: "2026-03-07 11:13",
      timeline: [
        { time: "11:40", event: "Compliance hold placed: address mismatch" },
        { time: "11:22", event: "CX escalated case to Compliance" },
        { time: "10:48", event: "Remittance TX-184991 flagged for KYC" },
      ],
    },
    "U-6640": {
      id: "U-6640",
      name: "Luis Mendoza",
      phone: "+1 (469) 555-1455",
      country: "US -> Guatemala",
      fraudScore: 92,
      holdReason: "Velocity rule triggered",
      kycStatus: "Verified",
      walletBalance: "$95.10",
      loanState: "No active loan",
      remittanceCount30d: 19,
      openCases: 2,
      resolvedCases90d: 1,
      lastContact: "2026-03-07 10:57",
      timeline: [
        { time: "11:31", event: "Fraud analyst blocked TX-184997" },
        { time: "11:27", event: "Risk vendor score updated: 0.94" },
        { time: "10:57", event: "CX informed customer of temporary hold" },
      ],
    },
    "U-9912": {
      id: "U-9912",
      name: "Sofia Delgado",
      phone: "+1 (281) 555-5551",
      country: "US -> Honduras",
      fraudScore: 44,
      holdReason: "Proof of income missing",
      kycStatus: "Needs Documents",
      walletBalance: "$1,121.42",
      loanState: "Current (1/6 paid)",
      remittanceCount30d: 4,
      openCases: 1,
      resolvedCases90d: 2,
      lastContact: "2026-03-06 19:20",
      timeline: [
        { time: "09:41", event: "Compliance requested additional docs" },
        { time: "09:21", event: "Loan disbursement held" },
        { time: "08:58", event: "Customer submitted partial docs" },
      ],
    },
    "U-5114": {
      id: "U-5114",
      name: "Ernesto Ruiz",
      phone: "+1 (713) 555-2283",
      country: "US -> El Salvador",
      fraudScore: 29,
      holdReason: "None",
      kycStatus: "Verified",
      walletBalance: "$63.90",
      loanState: "Delinquent (17 days)",
      remittanceCount30d: 2,
      openCases: 1,
      resolvedCases90d: 0,
      lastContact: "2026-03-07 08:11",
      timeline: [
        { time: "08:11", event: "Credit ops started repayment review" },
        { time: "08:04", event: "Auto-reminder SMS sent" },
        { time: "07:39", event: "Payment retry failed" },
      ],
    },
    "U-7742": {
      id: "U-7742",
      name: "Maribel Flores",
      phone: "+1 (832) 555-6621",
      country: "US -> Mexico",
      fraudScore: 12,
      holdReason: "None",
      kycStatus: "Verified",
      walletBalance: "$309.76",
      loanState: "No active loan",
      remittanceCount30d: 9,
      openCases: 1,
      resolvedCases90d: 6,
      lastContact: "2026-03-07 09:52",
      timeline: [
        { time: "09:52", event: "CX set case to ready-to-resolve" },
        { time: "09:33", event: "Remittance completed TX-184936" },
        { time: "09:20", event: "Wallet top-up succeeded" },
      ],
    },
  },
  audit: [
    {
      time: "2026-03-07 11:33",
      actor: "fraud.analyst@felix",
      action: "Blocked transaction TX-184997",
      customer: "Luis Mendoza",
      result: "approved",
    },
    {
      time: "2026-03-07 11:19",
      actor: "compliance.agent@felix",
      action: "Placed KYC hold",
      customer: "Ana Torres",
      result: "approved",
    },
    {
      time: "2026-03-07 10:57",
      actor: "cx.agent@felix",
      action: "Escalated case C-10071",
      customer: "Ana Torres",
      result: "approved",
    },
  ],
};

const el = {
  customerSearch: document.getElementById("customerSearch"),
  newCaseBtn: document.getElementById("newCaseBtn"),
  teamFilter: document.getElementById("teamFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  casesTableBody: document.getElementById("casesTableBody"),
  activeCustomerId: document.getElementById("activeCustomerId"),
  customerName: document.getElementById("customerName"),
  customerPhone: document.getElementById("customerPhone"),
  customerCountry: document.getElementById("customerCountry"),
  fraudScore: document.getElementById("fraudScore"),
  holdReason: document.getElementById("holdReason"),
  kycStatus: document.getElementById("kycStatus"),
  walletBalance: document.getElementById("walletBalance"),
  loanState: document.getElementById("loanState"),
  remittanceCount: document.getElementById("remittanceCount"),
  openCaseCount: document.getElementById("openCaseCount"),
  resolvedCaseCount: document.getElementById("resolvedCaseCount"),
  lastContact: document.getElementById("lastContact"),
  timelineList: document.getElementById("timelineList"),
  auditTableBody: document.getElementById("auditTableBody"),
  exportAuditBtn: document.getElementById("exportAuditBtn"),
  kpiOpenCases: document.getElementById("kpiOpenCases"),
  kpiTtr: document.getElementById("kpiTtr"),
  kpiSlaRisk: document.getElementById("kpiSlaRisk"),
  kpiAudit: document.getElementById("kpiAudit"),
};

function filteredCases() {
  return data.cases.filter((c) => {
    const teamOk = state.team === "all" || c.team === state.team;
    const pOk = state.priority === "all" || c.priority === state.priority;
    const q = state.query.trim().toLowerCase();
    const qOk =
      !q ||
      c.customerName.toLowerCase().includes(q) ||
      c.customerId.toLowerCase().includes(q);
    return teamOk && pOk && qOk;
  });
}

function renderKPIs(cases) {
  const total = cases.length;
  const avgTtr = total
    ? Math.round(cases.reduce((sum, c) => sum + c.medianTtrMinutes, 0) / total)
    : 0;
  const slaRisk = cases.filter((c) => c.slaMinutes < 60).length;
  el.kpiOpenCases.textContent = String(total);
  el.kpiTtr.textContent = `${avgTtr}m`;
  el.kpiSlaRisk.textContent = String(slaRisk);
  el.kpiAudit.textContent = "100%";
}

function renderCases() {
  const cases = filteredCases();
  renderKPIs(cases);

  if (!cases.length) {
    el.casesTableBody.innerHTML =
      '<tr><td colspan="6">No matching cases for current filters.</td></tr>';
    return;
  }

  if (!state.selectedCaseId || !cases.some((c) => c.id === state.selectedCaseId)) {
    state.selectedCaseId = cases[0].id;
  }

  el.casesTableBody.innerHTML = cases
    .map(
      (c) => `
      <tr class="selectable ${c.id === state.selectedCaseId ? "active" : ""}" data-case-id="${c.id}">
        <td>${c.id}</td>
        <td>${c.customerName}</td>
        <td>${c.team}</td>
        <td>${c.status}</td>
        <td><span class="badge ${c.priority}">${c.priority}</span></td>
        <td>${c.slaMinutes}m</td>
      </tr>
    `
    )
    .join("");

  Array.from(el.casesTableBody.querySelectorAll("tr.selectable")).forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedCaseId = row.dataset.caseId;
      renderAll();
    });
  });
}

function selectedCase() {
  return data.cases.find((c) => c.id === state.selectedCaseId) || data.cases[0];
}

function renderCustomerProfile() {
  const c = selectedCase();
  if (!c) return;
  const customer = data.customers[c.customerId];
  if (!customer) return;

  el.activeCustomerId.textContent = `${customer.id} / ${c.id}`;
  el.customerName.textContent = customer.name;
  el.customerPhone.textContent = customer.phone;
  el.customerCountry.textContent = customer.country;
  el.fraudScore.textContent = String(customer.fraudScore);
  el.holdReason.textContent = customer.holdReason;
  el.kycStatus.textContent = customer.kycStatus;
  el.walletBalance.textContent = customer.walletBalance;
  el.loanState.textContent = customer.loanState;
  el.remittanceCount.textContent = String(customer.remittanceCount30d);
  el.openCaseCount.textContent = String(customer.openCases);
  el.resolvedCaseCount.textContent = String(customer.resolvedCases90d);
  el.lastContact.textContent = customer.lastContact;

  el.timelineList.innerHTML = customer.timeline
    .map(
      (t) => `
      <li>
        <div class="time">${t.time}</div>
        <div>${t.event}</div>
      </li>
    `
    )
    .join("");
}

function renderAudit() {
  el.auditTableBody.innerHTML = data.audit
    .map(
      (a) => `
      <tr>
        <td>${a.time}</td>
        <td>${a.actor}</td>
        <td>${a.action}</td>
        <td>${a.customer}</td>
        <td>${a.result}</td>
      </tr>
    `
    )
    .join("");
}

function pushAudit(actionText) {
  const c = selectedCase();
  if (!c) return;
  const time = new Date().toISOString().slice(0, 16).replace("T", " ");
  data.audit.unshift({
    time,
    actor: "ops.agent@felix",
    action: actionText,
    customer: c.customerName,
    result: "approved",
  });
}

function wireActions() {
  Array.from(document.querySelectorAll(".action-grid button")).forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const labels = {
        release_hold: "Released compliance hold",
        request_docs: "Requested additional KYC documents",
        block_txn: "Blocked latest remittance transaction",
        mark_safe: "Marked customer as safe",
        pause_loan: "Paused loan repayment",
        grant_appeasement: "Granted appeasement credit $10",
      };
      pushAudit(labels[action] || "Executed manual action");
      renderAudit();
    });
  });
}

function exportAuditCsv() {
  const header = ["time", "actor", "action", "customer", "result"];
  const rows = data.audit.map((a) => [a.time, a.actor, a.action, a.customer, a.result]);
  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "felix_ops_audit_log_mock.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function renderAll() {
  renderCases();
  renderCustomerProfile();
  renderAudit();
}

function init() {
  state.selectedCaseId = data.cases[0].id;

  el.customerSearch.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderAll();
  });

  el.teamFilter.addEventListener("change", (e) => {
    state.team = e.target.value;
    renderAll();
  });

  el.priorityFilter.addEventListener("change", (e) => {
    state.priority = e.target.value;
    renderAll();
  });

  el.newCaseBtn.addEventListener("click", () => {
    alert("Mock action: would open new case creation flow.");
  });

  el.exportAuditBtn.addEventListener("click", exportAuditCsv);
  wireActions();
  renderAll();
}

init();
