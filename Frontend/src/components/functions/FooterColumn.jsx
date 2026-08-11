import React from "react";

export default function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="font-semibold text-[15px] text-ink mb-4">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-[14.5px] text-slate-600 hover:text-brand transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}