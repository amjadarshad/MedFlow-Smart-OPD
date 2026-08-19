import PortalCard from "./functions/PortalCard.jsx";
import { portals } from "../data/landingData.js";

export default function PortalAccess() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-display font-extrabold text-[32px] text-ink text-center mb-12">
          Portal Access
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => (
            <PortalCard key={portal.title} {...portal} />
          ))}
        </div>
      </div>
    </section>
  );
}
