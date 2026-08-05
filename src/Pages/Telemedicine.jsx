import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic, MicOff, VideoIcon, VideoOff, ImagePlus, MoreHorizontal, PhoneOff, Activity,
  Heart, Gauge, Droplet, Thermometer, FileText, FileImage, File,
  Download, ClipboardPlus, FlaskConical, History, UserPlus2, Maximize, Mail,
} from "lucide-react";
import ClinicalDataPanel from "../components/functions/ClinicalDataPanel.jsx";
import ChatPanel from "../components/functions/ChatPanel.jsx";
import { liveVitals as VITALS, sharedDocuments as DOCUMENTS, quickActions as QUICK_ACTIONS, chatMessages as CHAT_MESSAGES } from "../data/allData.js";

export default function Telemedicine() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("clinical"); // "clinical" | "chat"
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [lastSharedFile, setLastSharedFile] = useState(null);

  function handleImageSelected(e) {
    const file = e.target.files?.[0];
    if (file) setLastSharedFile(file.name);
    e.target.value = ""; // reset so selecting the same file again still fires onChange
  }

  function handleEnterFullscreen() {
    document.documentElement.requestFullscreen?.();
    setIsMoreMenuOpen(false);
  }

  function handleEndCall() {
    navigate("/dashboard/appointments");
  }

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

          {isCameraOff ? (
            <div className="absolute bottom-20 right-4 w-24 h-16 rounded-lg bg-slate-900 border-2 border-white/30 flex items-center justify-center">
              <VideoOff size={16} className="text-slate-400" />
            </div>
          ) : (
            <div className="absolute bottom-20 right-4 w-24 h-16 rounded-lg bg-slate-500 border-2 border-white/30" />
          )}

          {lastSharedFile && (
            <div className="absolute bottom-20 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white text-[11px]">📎 Shared: {lastSharedFile}</p>
            </div>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2.5">
            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${
                isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/15 hover:bg-white/25"
              }`}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={() => setIsCameraOff((prev) => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${
                isCameraOff ? "bg-red-500 hover:bg-red-600" : "bg-white/15 hover:bg-white/25"
              }`}
            >
              {isCameraOff ? <VideoOff size={16} /> : <VideoIcon size={16} />}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <ImagePlus size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelected}
              className="hidden"
            />

            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              {isMoreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)} />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-20">
                    <button
                      onClick={handleEnterFullscreen}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 text-left"
                    >
                      <Maximize size={14} />
                      Enter Fullscreen
                    </button>
                    
                    <a
                      href="mailto:support@medflow.com?subject=Telemedicine%20issue"
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 text-left"
                    >
                      <Mail size={14} />
                      Report Issue
                    </a>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleEndCall}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold px-4 py-2 rounded-full transition-colors ml-1"
            >
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
            {activeTab === "clinical" ? (
              <ClinicalDataPanel vitals={VITALS} documents={DOCUMENTS} />
            ) : (
              <ChatPanel messages={CHAT_MESSAGES} />
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mt-6">
        {QUICK_ACTIONS.map(({ label, sublabel, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
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