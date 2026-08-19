import { Link } from "react-router-dom";
import { ShieldCheck, Lock, CloudUpload, ListChecks, TrendingUp } from "lucide-react";

export default function Features() {
    return (
        <section className="bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-12">
                    <h2 className="font-display font-extrabold text-[32px] text-ink mb-3">
                        Unified Clinic Ecosystem
                    </h2>
                    <p className="text-slate-600 text-[16px]">
                        Powerful modules designed to eliminate administrative friction and prioritize care.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(220px,auto)]">
                    <div className="md:col-span-2 relative rounded-2xl overflow-hidden min-h-[340px] bg-gradient-to-br from-slate-700 to-slate-900">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent " />
                        <div className="relative h-full flex flex-col justify-end p-8 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d')",
                            }}
                        >              
                        <span className="inline-block w-fit bg-brand text- text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded mb-4">
                                Remote Care
                            </span>
                            <h3 className="font-display font-extrabold text-[28px] mb-2">
                                Online Consultation
                            </h3>
                            <p className="text-[14.5px] leading-relaxed max-w-md mb-5">
                                Encrypted HD video calls with integrated prescription modules and symptom checkers.
                            </p>
                            <Link
                                to="/login?tab=create"
                                className="w-fit bg-white text-ink font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                Explore Tech
                            </Link>
                        </div>
                    </div>

                    <div className="md:row-span-2 bg-brand rounded-2xl p-8 flex flex-col">
                        <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center mb-5">
                            <ShieldCheck size={22} className="text-white" />
                        </div>
                        <h3 className="font-display font-extrabold text-[24px] text-white mb-3 leading-tight">
                            Secure Digital Health Records
                        </h3>
                        <p className="text-blue-100 text-[14.5px] leading-relaxed mb-6">
                            End-to-end encrypted storage compliant with global health standards. Access patient
                            history in a single click.
                        </p>
                        <div className="flex flex-col gap-3 mt-auto">
                            <div className="flex items-center gap-2.5 bg-white/15 rounded-lg px-4 py-3">
                                <Lock size={16} className="text-white" />
                                <span className="text-white text-[13.5px] font-semibold">256-bit Encryption</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/15 rounded-lg px-4 py-3">
                                <CloudUpload size={16} className="text-white" />
                                <span className="text-white text-[13.5px] font-semibold">Cloud Sync Enabled</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-end min-h-[220px]">
                        <div className="flex items-center gap-2 text-mint font-semibold text-[13.5px] mb-3">
                            <ListChecks size={16} />
                            OPD Management
                        </div>
                        <h3 className="font-display font-bold text-[20px] text-ink mb-2">
                            Physical Queue Control
                        </h3>
                        <p className="text-slate-600 text-[14px] leading-relaxed">
                            Live waiting room updates and SMS tokens to reduce clinic overcrowding.
                        </p>
                    </div>

                    <div className="bg-mint rounded-2xl p-8 flex flex-col justify-end min-h-[220px]">
                        <div className="flex items-center gap-2 text-emerald-900 font-semibold text-[13.5px] mb-3">
                            <TrendingUp size={16} />
                            Clinic Insights
                        </div>
                        <h3 className="font-display font-bold text-[20px] text-emerald-950 mb-2">
                            Data-Driven Growth
                        </h3>
                        <p className="text-emerald-900/80 text-[14px] leading-relaxed">
                            Monitor patient footfall and consultant efficiency with visual dashboards.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
