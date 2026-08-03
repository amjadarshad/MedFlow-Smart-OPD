import React from "react";
import { Globe, Share2 } from "lucide-react";
import FooterColumn from "./functions/FooterColumn.jsx";
import { productLinks as PRODUCT_LINKS, resourceLinks as RESOURCE_LINKS, legalLinks as LEGAL_LINKS } from "../data/allData.js";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <p className="font-display font-extrabold text-[20px] text-brand mb-3">MedFlow</p>
          <p className="text-[14.5px] text-slate-600 leading-relaxed max-w-[240px]">
            The intelligent operation system for modern healthcare providers.
          </p>
        </div>

        <FooterColumn title="Product" links={PRODUCT_LINKS} />
        <FooterColumn title="Resources" links={RESOURCE_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <p className="text-[13.5px] font-medium text-slate-600">
            © 2024 MedFlow Systems Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <Globe size={18} className="hover:text-brand cursor-pointer transition-colors" />
            <Share2 size={18} className="hover:text-brand cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}