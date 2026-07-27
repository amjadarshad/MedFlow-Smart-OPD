import React, { useState } from "react";
import {
  Mic, VideoIcon, ImagePlus, MoreHorizontal, PhoneOff, Activity,
  Heart, Gauge, Droplet, Thermometer, FileText, Send, FileImage, File,
  Download, ClipboardPlus, FlaskConical, History, UserPlus2,
} from "lucide-react";

const VITALS = [
  { label: "Heart Rate", value: "82", unit: "bpm", icon: Heart },
  { label: "Blood Pressure", value: "128/84", unit: "mmHg", icon: Gauge },
  { label: "SpO2", value: "98", unit: "%", icon: Droplet },
  { label: "Temp", value: "36.8", unit: "°c", icon: Thermometer },
];

const DOCUMENTS = [
  { name: "chest_xray_24-10.jpg", meta: "Uploaded 5m ago", icon: FileImage, iconBg: "bg-brand-light", iconColor: "text-brand" },
  { name: "blood_report_Q3.pdf", meta: "Shared by Patient", icon: File, iconBg: "bg-mint-light", iconColor: "text-mint" },
];

const QUICK_ACTIONS = [
  { label: "New Prescription", sublabel: "Action", icon: ClipboardPlus },
  { label: "Lab Investigation", sublabel: "Request", icon: FlaskConical },
  { label: "Past History", sublabel: "Review", icon: History },
  { label: "Specialist Referral", sublabel: "Referral", icon: UserPlus2 },
];

const CHAT_MESSAGES = [
  { from: "patient", text: "Good morning doctor, I've had this cough for about a week now." },
  { from: "doctor", text: "Good morning Eleanor. Any fever or shortness of breath along with it?" },
  { from: "patient", text: "A mild fever yesterday evening, nothing since then." },
];

function VitalCard({ label, value, unit, icon: Icon }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} className="text-brand" />
        <p className="text-[10.5px] font-semibold text-slate-500">{label}</p>
      </div>
      <p className="font-display font-extrabold text-ink text-[18px]">
        {value} <span className="text-[11px] font-body font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

function ClinicalDataPanel() {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Activity size={15} className="text-brand" />
          <p className="font-bold text-ink text-[14px]">Live Vitals</p>
        </div>
        <span className="bg-mint-light text-emerald-700 text-[10.5px] font-bold px-2.5 py-1 rounded-full">
          Syncing
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {VITALS.map((v) => (
          <VitalCard key={v.label} {...v} />
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <FileText size={15} className="text-brand" />
        <p className="font-bold text-ink text-[14px]">Consultation Notes</p>
      </div>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Chief Complaint</label>
      <textarea
        rows={2}
        placeholder="Enter patient's primary concern..."
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand placeholder:text-slate-400 resize-none mb-3"
      />
      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Observations</label>
      <textarea
        rows={2}
        placeholder="Physical signs, respiratory rate, etc..."
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand placeholder:text-slate-400 resize-none mb-6"
      />

      <p className="font-bold text-ink text-[14px] mb-3">Shared Documents</p>
      <div className="flex flex-col gap-2">
        {DOCUMENTS.map((doc) => (
          <div key={doc.name} className="flex items-center gap-2.5 bg-slate-50 rounded-lg p-2.5">
            <div className={`w-8 h-8 rounded-lg ${doc.iconBg} flex items-center justify-center shrink-0`}>
              <doc.icon size={14} className={doc.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-ink truncate">{doc.name}</p>
              <p className="text-[11px] text-slate-400">{doc.meta}</p>
            </div>
            <Download size={14} className="text-slate-400 hover:text-brand cursor-pointer shrink-0" />
          </div>
        ))}
      </div>
    </>
  );
}

function ChatPanel() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto mb-3">
        {CHAT_MESSAGES.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
              msg.from === "doctor"
                ? "bg-brand text-white self-end rounded-br-sm"
                : "bg-slate-100 text-ink self-start rounded-bl-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setMessage("");
        }}
        className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 outline-none text-[13px] placeholder:text-slate-400"
        />
        <button type="submit" className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0">
          <Send size={13} className="text-white" />
        </button>
      </form>
    </div>
  );
}

export default function Telemedicine() {
  const [activeTab, setActiveTab] = useState("clinical"); // "clinical" | "chat"

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <p className="text-[13px] font-semibold text-ink">Live Consultation: Patient ID #8842</p>
      </div>

      <div className="grid xl:grid-cols-[1fr_340px] gap-6">
        <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-[4/3] xl:aspect-auto xl:min-h-[520px]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800" />

          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3.5 py-2">
            <p className="text-white font-bold text-[13px]">Eleanor Rigby, 74</p>
            <p className="text-slate-300 text-[11px]">📍 London, UK</p>
          </div>

          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            <span className="text-white text-[12px] font-semibold">15:15</span>
          </div>

          <div className="absolute bottom-20 right-4 w-24 h-16 rounded-lg bg-slate-500 border-2 border-white/30" />

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2.5">
            <button className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
              <Mic size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
              <VideoIcon size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
              <ImagePlus size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
            <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold px-4 py-2 rounded-full transition-colors ml-1">
              <PhoneOff size={15} />
              End Call
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 flex flex-col">
          <div className="flex border-b border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab("clinical")}
              className={`flex-1 py-3.5 text-[13px] font-bold border-b-2 transition-colors ${
                activeTab === "clinical" ? "border-brand text-brand" : "border-transparent text-slate-400"
              }`}
            >
              Clinical Data
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3.5 text-[13px] font-bold border-b-2 transition-colors ${
                activeTab === "chat" ? "border-brand text-brand" : "border-transparent text-slate-400"
              }`}
            >
              Chat &amp; Files
            </button>
          </div>

          <div className="p-5 flex-1 min-h-0">
            {activeTab === "clinical" ? <ClinicalDataPanel /> : <ChatPanel />}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mt-6">
        {QUICK_ACTIONS.map(({ label, sublabel, icon: Icon }) => (
          <button
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-brand transition-colors"
          >
            <Icon size={18} className="text-brand mb-2" />
            <p className="text-[11px] text-slate-400 font-semibold">{sublabel}</p>
            <p className="font-bold text-ink text-[13.5px]">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}