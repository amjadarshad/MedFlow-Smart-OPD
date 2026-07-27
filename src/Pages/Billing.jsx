import React, { useState } from "react";
import {
  PlusCircle, Wallet, Clock, BadgeCheck, Calendar, Filter, ChevronDown,
  X, Printer, Mail, Eye, MoreVertical, AlertTriangle, History,
  CheckCircle2, FileText, XCircle, RefreshCcw,
} from "lucide-react";

const KPIS = [
  { label: "Total Revenue (Monthly)", value: "$124,500.00", note: "↗ +12.5% from last month", icon: Wallet },
  { label: "Pending Payments", value: "$12,430.50", note: "⚠ 14 Invoices Overdue", icon: Clock },
];

const INVOICES = [
  { initials: "JD", avatarBg: "bg-brand", patient: "John Doe", id: "P-9821", date: "Oct 24, 2023", invoiceNo: "#INV-2023-001", amount: "$450.00", status: "Paid" },
  { initials: "AS", avatarBg: "bg-mint", patient: "Alice Smith", id: "P-9822", date: "Oct 25, 2023", invoiceNo: "#INV-2023-002", amount: "$1,200.00", status: "Pending" },
  { initials: "RW", avatarBg: "bg-red-400", patient: "Robert Wilson", id: "P-9755", date: "Oct 12, 2023", invoiceNo: "#INV-2023-003", amount: "$280.00", status: "Overdue" },
  { initials: "ML", avatarBg: "bg-slate-400", patient: "Maria Lopez", id: "P-9911", date: "Oct 26, 2023", invoiceNo: "#INV-2023-004", amount: "$89.00", status: "Paid" },
];

const ACTIVITY = [
  { icon: CheckCircle2, tint: "text-emerald-600", bg: "bg-mint-light", title: "Payment Received", detail: "John Doe paid $450.00 via Credit Card", time: "2 mins ago" },
  { icon: FileText, tint: "text-brand", bg: "bg-brand-light", title: "New Invoice Generated", detail: "#INV-2023-088 for Alice Smith", time: "45 mins ago" },
  { icon: XCircle, tint: "text-red-500", bg: "bg-red-50", title: "Payment Failed", detail: "Card transaction declined for Mike Ross", time: "2 hours ago" },
  { icon: RefreshCcw, tint: "text-emerald-600", bg: "bg-mint-light", title: "Auto-Payment Success", detail: "Subscription renewed for Sarah Connor", time: "5 hours ago" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INCOME_SERIES = [30, 45, 38, 60, 50, 25, 20];
const PROJECTED_SERIES = [35, 40, 45, 55, 58, 40, 35];

const PAYMENT_METHODS = [
  { label: "Credit Card", value: "65%", amount: "$80k", color: "text-brand" },
  { label: "Cash", value: "15%", amount: "$18k", color: "text-slate-600" },
  { label: "Insurance", value: "18%", amount: "$22k", color: "text-brand" },
  { label: "Others", value: "2%", amount: "$4.5k", color: "text-slate-600" },
];

const STATUS_STYLES = {
  Paid: "bg-mint-light text-emerald-700",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-600",
};

/* --- Simple two-line SVG chart, same coordinate-math idea as the donut chart --- */
function LineChart({ seriesA, seriesB, labels }) {
  const width = 600;
  const height = 140;
  const max = Math.max(...seriesA, ...seriesB);
  const stepX = width / (labels.length - 1);

  function toPoints(series) {
    return series
      .map((val, i) => `${i * stepX},${height - (val / max) * height}`)
      .join(" ");
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36" preserveAspectRatio="none">
      <polyline points={toPoints(PROJECTED_SERIES)} fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
      <polyline points={toPoints(seriesA)} fill="none" stroke="#1652F0" strokeWidth="2.5" />
    </svg>
  );
}

function KPICard({ label, value, note, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-semibold text-brand">{label}</p>
        <Icon size={16} className="text-slate-300" />
      </div>
      <p className="font-display font-extrabold text-[24px] text-ink mb-1">{value}</p>
      {note && <p className="text-[12px] text-slate-500">{note}</p>}
      {children}
    </div>
  );
}

export default function Billing() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvoices =
    statusFilter === "All" ? INVOICES : INVOICES.filter((inv) => inv.status === statusFilter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[24px] text-ink mb-1">Billing &amp; Invoices</h1>
          <p className="text-slate-600 text-[14px]">Track revenue, manage patient payments, and generate invoices.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-lg transition-colors">
          <PlusCircle size={16} />
          Create New Invoice
        </button>
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <KPICard label="Total Revenue (Monthly)" value="$124,500.00" note="↗ +12.5% from last month" icon={Wallet} />
        <KPICard label="Pending Payments" value="$12,430.50" note="⚠ 14 Invoices Overdue" icon={Clock} />
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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] text-slate-600 bg-white">
            <Calendar size={14} />
            Last 30 Days
            <ChevronDown size={13} />
          </button>
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
          <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3.5 py-2 text-[13px] text-slate-600 bg-white">
            Method: All
            <ChevronDown size={13} />
          </button>
        </div>
        <button
          onClick={() => setStatusFilter("All")}
          className="flex items-center gap-1.5 text-[13px] text-brand font-semibold hover:underline"
        >
          <X size={13} />
          Clear All Filters
        </button>
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <table className="w-full text-left text-[13px]">
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
                    <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      {isOverdue && <AlertTriangle size={15} className="text-red-500" />}
                      {inv.status === "Pending" ? (
                        <button className="bg-brand hover:bg-brand-dark text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          Pay Now
                        </button>
                      ) : (
                        <Printer size={15} className="hover:text-brand cursor-pointer" />
                      )}
                      <Mail size={15} className="hover:text-brand cursor-pointer" />
                      {inv.status === "Paid" && <Eye size={15} className="hover:text-brand cursor-pointer" />}
                      <MoreVertical size={15} className="hover:text-brand cursor-pointer" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
            {ACTIVITY.map((item) => (
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

          <LineChart seriesA={INCOME_SERIES} seriesB={PROJECTED_SERIES} labels={DAYS} />
          <div className="flex justify-between text-[11px] text-slate-500 mb-5">
            {DAYS.map((d) => (
              <span key={d} className="flex-1 text-center">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            {PAYMENT_METHODS.map((m) => (
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
    </div>
  );
}