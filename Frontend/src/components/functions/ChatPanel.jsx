import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPanel({ messages = [] }) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto mb-3">
        {messages.map((msg, i) => (
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
