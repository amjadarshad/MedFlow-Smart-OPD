import { useState } from "react";
import {
  PlusCircle, Wallet, Clock, BadgeCheck, Calendar, Filter, ChevronDown,
  X, Printer, Mail, Eye, MoreVertical, AlertTriangle, History,
} from "lucide-react";
import LineChart from "../components/functions/LineChart.jsx";
import BillingKPICard from "../components/functions/BillingKPICard.jsx";
import {
  invoices,
  billingActivity as activity,
  revenueDays as days,
  incomeSeries,
  projectedSeries,
  paymentMethods,
  invoiceStatusStyles as statusStyles,
} from "../data/allData";

const dateRangeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];
const methodOptions = ["All", "Credit Card", "Cash", "Insurance", "Others"];

export default function Billing() {
  const [invoicesList, setInvoicesList] = useState(invoices);
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState(1);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ patient: "", amount: "" });

  const filteredInvoices = invoicesList.filter((inv) => {
    const statusMatches = statusFilter === "All" || inv.status === statusFilter;
    const methodMatches = methodFilter === "All" || inv.method === methodFilter;
    return statusMatches && methodMatches;
  });

  function closeAllMenus() {
    setIsDateOpen(false);
    setIsMethodOpen(false);
  }

  function handleClearFilters() {
    setStatusFilter("All");
    setMethodFilter("All");
  }

  function handleMarkAsPaid(invoiceNo) {
    setInvoicesList((prev) =>
      prev.map((inv) => (inv.invoiceNo === invoiceNo ? { ...inv, status: "Paid" } : inv))
    );
  }

  function handleCreateInvoice(e) {
    e.preventDefault();
    if (!newInvoice.patient.trim() || !newInvoice.amount.trim()) return;

    const initials = newInvoice.patient
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const invoice = {
      initials,
      avatarBg: "bg-brand",
      patient: newInvoice.patient.trim(),
      id: `P-${Math.floor(9000 + Math.random() * 999)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      invoiceNo: `#INV-2026-${String(invoicesList.length + 1).padStart(3, "0")}`,
      amount: `$${Number(newInvoice.amount).toFixed(2)}`,
      status: "Pending",
      method: "Others",
    };

    setInvoicesList((prev) => [invoice, ...prev]);
    setNewInvoice({ patient: "", amount: "" });
    setIsCreateOpen(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] text-ink mb-1">Billing &amp; Invoices</h1>
          <p className="text-slate-600 text-[14px]">Track revenue, manage patient payments, and generate invoices.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={16} />
          Create New Invoice
        </button>
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <BillingKPICard label="Total Revenue (Monthly)" value="$124,500.00" note="↗ +12.5% from last month" icon={Wallet} />
        <BillingKPICard label="Pending Payments" value="$12,430.50" note="⚠ 14 Invoices Overdue" icon={Clock} />
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-brand">Collection Rate</p>
            <BadgeCheck size={16} className="text-slate-300" />
          </div>
          <p className="font-display font-extrabold text-[24px] text-ink mb-3">94.2%</p>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-mint rounded-full" style={{ width: "94.2%" }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      {(isDateOpen || isMethodOpen) && <div className="fixed inset-0 z-10" onClick={closeAllMenus} />}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative z-20">
            <button
              onClick={() => {
                setIsDateOpen((prev) => !prev);
                setIsMethodOpen(false);
              }}
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] text-slate-600 bg-white"
            >
              <Calendar size={14} />
              {dateRange}
              <ChevronDown size={13} />
            </button>
            {isDateOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                {dateRangeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateRange(opt);
                      setIsDateOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-[13px] text-left hover:bg-slate-50 ${
                      dateRange === opt ? "text-brand font-semibold" : "text-slate-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-[13px] text-slate-600 bg-white outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Paid">Status: Paid</option>
              <option value="Pending">Status: Pending</option>
              <option value="Overdue">Status: Overdue</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative z-20">
            <button
              onClick={() => {
                setIsMethodOpen((prev) => !prev);
                setIsDateOpen(false);
              }}
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] text-slate-600 bg-white"
            >
              Method: {methodFilter}
              <ChevronDown size={13} />
            </button>
            {isMethodOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                {methodOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setMethodFilter(opt);
                      setIsMethodOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-[13px] text-left hover:bg-slate-50 ${
                      methodFilter === opt ? "text-brand font-semibold" : "text-slate-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1.5 text-[13px] text-brand font-semibold hover:underline"
        >
          <X size={13} />
          Clear All Filters
        </button>
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead>
            <tr className="bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-semibold">Patient Name</th>
              <th className="px-5 py-3 font-semibold">Service Date</th>
              <th className="px-5 py-3 font-semibold">Invoice #</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((inv) => {
              const isOverdue = inv.status === "Overdue";
              return (
                <tr key={inv.invoiceNo} className={isOverdue ? "bg-red-50/50 border-l-4 border-red-400" : ""}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${inv.avatarBg} text-white flex items-center justify-center text-[11px] font-bold shrink-0`}>
                        {inv.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{inv.patient}</p>
                        <p className="text-[11px] text-slate-400">ID: {inv.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{inv.date}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-[12px]">{inv.invoiceNo}</td>
                  <td className="px-5 py-3.5 font-bold text-ink">{inv.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      {isOverdue && <AlertTriangle size={15} className="text-red-500" />}
                      {inv.status === "Pending" ? (
                        <button
                          onClick={() => handleMarkAsPaid(inv.invoiceNo)}
                          className="bg-brand hover:bg-brand-dark text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <Printer
                          size={15}
                          className="hover:text-brand cursor-pointer"
                          onClick={() => window.print()}
                        />
                      )}
                      <a href={`mailto:?subject=Invoice ${inv.invoiceNo}&body=Invoice for ${inv.patient}, amount ${inv.amount}`}>
                        <Mail size={15} className="hover:text-brand cursor-pointer" />
                      </a>
                      {inv.status === "Paid" && <Eye size={15} className="hover:text-brand cursor-pointer" />}
                      <MoreVertical size={15} className="hover:text-brand cursor-pointer" />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-[13px]">
                  No invoices match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
          <span className="text-[12.5px] text-slate-500">Showing 1-10 of 156 Invoices</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"
            >
              ‹
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-md text-[12.5px] font-semibold transition-colors ${
                  currentPage === page ? "bg-brand text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Activity + Revenue trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-ink text-[15px]">Recent Activity</p>
            <History size={15} className="text-slate-400" />
          </div>
          <div className="flex flex-col gap-3">
            {activity.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon size={15} className={item.tint} />
                </div>
                <div>
                  <p className="font-bold text-ink text-[13px]">{item.title}</p>
                  <p className="text-slate-500 text-[12px]">{item.detail}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-ink text-[15px]">Revenue Trends</p>
            <div className="flex items-center gap-4 text-[12px] text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Projected</span>
            </div>
          </div>
          <p className="text-slate-500 text-[12px] mb-4">Cashflow projection for the next 7 days</p>

          <LineChart seriesA={incomeSeries} seriesB={projectedSeries} labels={days} />
          <div className="flex justify-between text-[11px] text-slate-500 mb-5">
            {days.map((d) => (
              <span key={d} className="flex-1 text-center">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            {paymentMethods.map((m) => (
              <div key={m.label}>
                <p className="text-[11px] text-slate-500 mb-0.5">{m.label}</p>
                <p className={`text-[13px] font-bold ${m.color}`}>
                  {m.value} <span className="text-slate-400 font-normal">({m.amount})</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create New Invoice modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="create-invoice-title" className="bg-white rounded-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 id="create-invoice-title" className="font-display font-extrabold text-[16px] text-ink">Create New Invoice</h2>
              <button type="button" aria-label="Close invoice dialog" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-600 mb-1.5">Patient Name</label>
                <input
                  value={newInvoice.patient}
                  onChange={(e) => setNewInvoice((prev) => ({ ...prev, patient: e.target.value }))}
                  placeholder="e.g. Ahmed Raza"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-600 mb-1.5">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g. 250"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-brand"
                />
              </div>
              <button
                type="submit"
                className="bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] py-2.5 rounded-lg transition-colors mt-1"
              >
                Create Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
