import { useEffect, useState, useRef } from "react";
import logoUrl from "container:///mnt/data/src/assets/ceaea5b5a30ab9a0-photo6806790438155437360.jpeg";
import gcash1Url from "container:///mnt/data/src/assets/78cff41c4ceebea7-cropped_gcash_09999690008.png";
import gcash2Url from "container:///mnt/data/src/assets/f1296df4306a8f1f-cropped_gcash_09664903825.png";
import bpiQrUrl from "container:///mnt/data/src/assets/4e23749ffccb1ff7-cropped_bpi_loys.png";

type ReceiptRecord = {
  id: string;
  value: {
    payerName: string;
    amount: string;
    refNo: string;
    contact?: string;
    account: string;
  };
  created_at: string;
};

export default function App() {
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [form, setForm] = useState({ payerName: "", amount: "", refNo: "", account: "BPI 8119903131 - LOYS BPI", contact: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string>("bpi");
  const payRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      setLoadingRecords(true);
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.list", args: { collection: "receipts", limit: 60 } }),
      });
      const json = await res.json();
      if (json.data?.records) {
        setReceipts((json.data.records as ReceiptRecord[]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      }
    } catch (e) {
      console.log("offline", e);
    } finally {
      setLoadingRecords(false);
    }
  };
  useEffect(() => { load(); }, []);

  const copy = (text: string, id: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.payerName || !form.amount || !form.refNo) {
      setMsg("Please complete Name, Amount and Reference No.");
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: {
            collection: "receipts",
            value: form,
            idempotency_key: `${form.refNo}-${form.payerName}`.toLowerCase().slice(0, 120),
          },
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMsg("✅ Receipt saved. Please also send screenshot to FB / Email below.");
      setForm({ payerName: "", amount: "", refNo: "", account: "BPI 8119903131 - LOYS BPI", contact: "" });
      await load();
    } catch (err: any) {
      setMsg(err.message || "Failed to save. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full text-white overflow-x-clip relative selection:bg-[#00D4FF]/30"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)", background: "#0A0E1A" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        .orbitron { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        * { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes gridMove { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }
        @keyframes fiber { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 600; } }
        @keyframes pulseGlow { 0%,100% { opacity: 0.6; filter: blur(18px); } 50% { opacity: 1; filter: blur(24px); } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[#0A0E1A]" />
        {/* blue grid */}
        <div className="absolute inset-0 opacity-[0.18]" style={{
          backgroundImage: `linear-gradient(rgba(0,125,254,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0,125,254,0.18) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute inset-0 opacity-[0.10]" style={{
          backgroundImage: `linear-gradient(rgba(56,189,248,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.2) 1px, transparent 1px)`,
          backgroundSize: '12px 12px'
        }} />
        {/* radial glow */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(1200px circle at 15% 0%, rgba(0,125,254,0.22), transparent 60%), radial-gradient(900px circle at 85% 15%, rgba(14,165,233,0.18), transparent 55%), radial-gradient(800px circle at 50% 100%, rgba(0,125,254,0.15), transparent 60%), radial-gradient(600px circle at 95% 90%, rgba(239,68,68,0.08), transparent 60%)`
        }} />
        {/* fiber optic lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.55]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fiberBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007DFE" stopOpacity="0" />
              <stop offset="30%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="70%" stopColor="#007DFE" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fiberRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M -200 120 Q 300 60 700 150 T 1700 120" stroke="url(#fiberBlue)" strokeWidth="1.2" fill="none" strokeDasharray="12 18" style={{ animation: 'fiber 8s linear infinite' }} />
          <path d="M -200 320 Q 500 280 900 360 T 1700 300" stroke="url(#fiberBlue)" strokeWidth="1" fill="none" opacity="0.7" strokeDasharray="10 22" style={{ animation: 'fiber 12s linear infinite reverse' }} />
          <path d="M -200 520 Q 400 480 800 540 T 1700 500" stroke="url(#fiberRed)" strokeWidth="0.8" fill="none" opacity="0.5" strokeDasharray="8 20" style={{ animation: 'fiber 15s linear infinite' }} />
        </svg>
      </div>

      {/* HEADER */}
      <header data-safe-area-sticky-top className="sticky z-40 backdrop-blur-[20px] border-b border-white/[0.08] bg-[#0A0E1A]/85" style={{ top: "var(--safe-area-inset-top)" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-auto py-4 md:py-5 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="relative shrink-0 group">
            <div className="absolute -inset-2 rounded-[18px] bg-gradient-to-r from-[#007DFE]/30 to-[#38BDF8]/30 blur-[18px] opacity-80 group-hover:blur-[22px] transition" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }} />
            <div className="absolute -inset-[1px] rounded-[16px] bg-gradient-to-r from-[#007DFE] to-[#38BDF8] opacity-70" />
            <div className="relative rounded-[14px] bg-white p-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_10px_30px_rgba(0,0,0,0.4),0_0_40px_rgba(0,125,254,0.25)]">
              <img src={logoUrl} alt="LOY'S FIBERNETWORKS IT SOLUTIONS logo - San Isidro Bilar & Carmen Bohol" className="w-[280px] sm:w-[340px] md:w-[380px] h-auto object-contain rounded-[8px] block" />
            </div>
            <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-[#007DFE] text-white mono text-[8px] font-bold tracking-widest shadow-[0_0_10px_rgba(0,125,254,0.6)]">OFFICIAL</div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-[#38BDF8]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_#38BDF8]" />
              <span className="mono text-[10px] tracking-[0.18em] text-[#38BDF8] font-bold">OFFICIAL PAYMENT PORTAL • 2025 • VERIFIED</span>
            </div>
            <h1 className="orbitron font-black leading-[0.95] tracking-tight mt-2.5 text-[18px] sm:text-[22px] md:text-[26px]">
              <span className="text-white">LOY'S FIBERNETWORKS</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#007DFE] via-[#38BDF8] to-[#7DD3FC] text-[14px] sm:text-[16px] md:text-[18px] tracking-[0.16em] mt-1">OFFICIAL PAYMENT ACCOUNTS</span>
            </h1>
            <p className="mono text-[11.5px] md:text-[12px] text-white/55 mt-2 tracking-wide">Secure Instant Payment - BPI & GCash • InstaPay Enabled • San Isidro, Bilar & Carmen, Bohol</p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#00C853]/15 border border-[#00C853]/30 mono text-[9px] tracking-widest text-[#69F0AE]">● 100% SECURE</span>
              <span className="px-2.5 py-1 rounded-full bg-[#007DFE]/15 border border-[#007DFE]/30 mono text-[9px] tracking-widest text-[#38BDF8]">INSTAPAY VERIFIED</span>
            </div>
            <button onClick={() => payRef.current?.scrollIntoView({ behavior: 'smooth' })} className="orbitron text-[11px] font-bold tracking-widest px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition shadow-[0_0_20px_rgba(255,255,255,0.25)]">PAY NOW ↓</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 pb-16">
        {/* QUICK COPY BAR */}
        <div className="mt-6 md:mt-8 rounded-[16px] bg-[#111827]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 mono text-[10px] tracking-widest text-white/50">
            <span className="w-5 h-5 rounded-full bg-[#007DFE]/20 border border-[#007DFE]/30 flex items-center justify-center text-[12px]">⚡</span>
            QUICK COPY - ONE TAP
            <span className="hidden md:inline h-3 w-[1px] bg-white/10 mx-1" />
            <span className="hidden md:inline text-white/30">BPI + 2 GCASH NUMBERS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
            {[
              { id: "bpi", num: "8119903131", label: "BPI • LOYS BPI", color: "from-[#EF4444]/20 to-[#EF4444]/5 border-[#EF4444]/30 text-[#FCA5A5]" },
              { id: "gcash1", num: "09999690008", label: "GCash • SH*N J 1", color: "from-[#007DFE]/20 to-[#007DFE]/5 border-[#007DFE]/30 text-[#7DD3FC]" },
              { id: "gcash2", num: "09664903825", label: "GCash • SH*N J 2", color: "from-[#0EA5E9]/20 to-[#0EA5E9]/5 border-[#0EA5E9]/30 text-[#BAE6FD]" },
            ].map((c) => (
              <button key={c.id} onClick={() => copy(c.num, `quick-${c.id}`)} className={`group relative flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] bg-gradient-to-br ${c.color} border backdrop-blur transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,125,254,0.25)] w-full text-left`}>
                <div>
                  <div className="mono text-[8px] tracking-widest opacity-70">{c.label}</div>
                  <div className="mono text-[14px] font-bold tracking-wider text-white">{c.num}</div>
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${copiedId === `quick-${c.id}` ? "bg-[#00C853] border-[#00C853] text-black" : "bg-white/10 border-white/15 text-white group-hover:bg-white group-hover:text-black"}`}>
                  {copiedId === `quick-${c.id}` ? "✓" : "⎘"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PAYMENT CARDS GRID */}
        <div ref={payRef} id="pay" className="mt-8 grid md:grid-cols-3 gap-5 md:gap-6">
          {/* BPI */}
          <div onMouseEnter={() => setActiveCard("bpi")} className={`relative rounded-[24px] overflow-hidden border backdrop-blur-xl transition-all duration-500 ${activeCard === "bpi" ? "border-[#EF4444]/60 shadow-[0_0_40px_rgba(239,68,68,0.22),0_0_80px_rgba(239,68,68,0.12)] scale-[1.02]" : "border-white/10 hover:border-[#EF4444]/30"}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#1F0F15]/90 to-[#0A0E1A]/90" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/80 to-transparent" />
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#EF4444]/15 blur-[40px] rounded-full pointer-events-none" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#EF4444] to-[#991B1B] flex items-center justify-center text-white font-black text-[13px] shadow-[0_0_15px_rgba(239,68,68,0.5)]">BPI</div>
                  <div>
                    <div className="orbitron text-[11px] font-bold tracking-[0.15em]">BPI BANK</div>
                    <div className="mono text-[10px] text-white/50">InstaPay • Savings</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/30 mono text-[9px] tracking-widest text-[#FCA5A5]">RED • PRIMARY</span>
              </div>

              {/* QR white card - pixel perfect */}
              <div className="rounded-[20px] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="mono text-[9px] font-bold tracking-widest text-[#991B1B]">BPI QR • INSTAPAY • LOYS BPI</span>
                  <span className="mono text-[8px] px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">SCAN</span>
                </div>
                <div className="aspect-square w-full bg-white rounded-[14px] overflow-hidden border border-black/[0.06] relative">
                  {/* keep QR pixel perfect, no filters */}
                  <img src={bpiQrUrl} alt="BPI QR 8119903131 LOYS BPI - pixel perfect scannable" className="w-full h-full object-contain block" style={{ imageRendering: 'auto' }} />
                  {/* subtle scanline overlay - does not affect QR pixels (pointer-events none, low opacity) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
                    <div className="absolute inset-x-0 h-[40%] bg-gradient-to-b from-white to-transparent" style={{ animation: 'scanline 3s linear infinite' }} />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="mono text-[10px] text-black/60">Account Name: <span className="font-bold text-black">LOYS BPI</span> ✓</div>
                    <div className="mono text-[8px] px-1.5 py-0.5 rounded bg-black/5 text-black/50">8119903131</div>
                  </div>
                  <div className="rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="mono text-[8px] tracking-widest text-[#991B1B]/70">BPI ACCOUNT NUMBER</div>
                      <div className="mono text-[18px] font-black tracking-wider text-[#991B1B]">8119903131</div>
                      <div className="mono text-[9px] text-black/50 mt-0.5">LOYS BPI • InstaPay Ready</div>
                    </div>
                    <button onClick={() => copy("8119903131", "bpi-card")} className={`h-9 px-4 rounded-full mono text-[11px] font-bold tracking-widest transition ${copiedId === "bpi-card" ? "bg-[#00C853] text-black" : "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-[0_0_15px_rgba(239,68,68,0.35)]"}`}>
                      {copiedId === "bpi-card" ? "✓ COPIED" : "COPY"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 mono text-[10px] text-[#FCA5A5]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                Transfer from any bank app via InstaPay • Fee may apply
              </div>
            </div>
          </div>

          {/* GCash 09999690008 */}
          <div onMouseEnter={() => setActiveCard("g1")} className={`relative rounded-[24px] overflow-hidden border backdrop-blur-xl transition-all duration-500 ${activeCard === "g1" ? "border-[#007DFE]/60 shadow-[0_0_40px_rgba(0,125,254,0.24),0_0_80px_rgba(56,189,248,0.16)] scale-[1.02]" : "border-white/10 hover:border-[#007DFE]/30"}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F1D32]/90 to-[#0A0E1A]/90" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#007DFE]/80 to-transparent" />
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#007DFE]/18 blur-[40px] rounded-full pointer-events-none" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#007DFE] to-[#0284C7] flex items-center justify-center text-white font-black text-[13px] shadow-[0_0_15px_rgba(0,125,254,0.5)]">G</div>
                  <div>
                    <div className="orbitron text-[11px] font-bold tracking-[0.15em]">GCASH #1</div>
                    <div className="mono text-[10px] text-white/50">SH*N J • Official</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#007DFE]/15 border border-[#007DFE]/30 mono text-[9px] tracking-widest text-[#7DD3FC]">BLUE • VERIFIED</span>
              </div>

              <div className="rounded-[20px] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="mono text-[9px] font-bold tracking-widest text-[#007DFE]">GCASH QR • +63 999 969 • SH*N J</span>
                  <span className="mono text-[8px] px-2 py-0.5 rounded-full bg-[#007DFE]/10 text-[#007DFE] border border-[#007DFE]/20">QR 1</span>
                </div>
                <div className="aspect-square w-full bg-white rounded-[14px] overflow-hidden border border-black/[0.06] relative">
                  <img src={gcash1Url} alt="GCash QR 09999690008 SH*N J +63 999 969 0008 - pixel perfect scannable" className="w-full h-full object-contain block" />
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
                    <div className="absolute inset-x-0 h-[40%] bg-gradient-to-b from-[#007DFE] to-transparent" style={{ animation: 'scanline 3.2s linear infinite' }} />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="mono text-[10px] text-black/60">Name: <span className="font-bold text-black">SH*N J</span> ✓ Verified</div>
                    <div className="mono text-[8px] px-1.5 py-0.5 rounded bg-black/5 text-black/50">InstaPay</div>
                  </div>
                  <div className="rounded-[12px] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="mono text-[8px] tracking-widest text-[#1E40AF]/70">GCASH NUMBER</div>
                      <div className="mono text-[18px] font-black tracking-wider text-[#1E3A8A]">09999690008</div>
                      <div className="mono text-[9px] text-black/50 mt-0.5">+63 999 969 0008 • SH*N J</div>
                    </div>
                    <button onClick={() => copy("09999690008", "g1-card")} className={`h-9 px-4 rounded-full mono text-[11px] font-bold tracking-widest transition ${copiedId === "g1-card" ? "bg-[#00C853] text-black" : "bg-[#007DFE] text-white hover:bg-[#0063CB] shadow-[0_0_15px_rgba(0,125,254,0.35)]"}`}>
                      {copiedId === "g1-card" ? "✓ COPIED" : "COPY"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 mono text-[10px] text-[#7DD3FC]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                Open GCash → Scan QR → Confirm SH*N J
              </div>
            </div>
          </div>

          {/* GCash 09664903825 */}
          <div onMouseEnter={() => setActiveCard("g2")} className={`relative rounded-[24px] overflow-hidden border backdrop-blur-xl transition-all duration-500 ${activeCard === "g2" ? "border-[#0EA5E9]/60 shadow-[0_0_40px_rgba(14,165,233,0.22),0_0_80px_rgba(14,165,233,0.12)] scale-[1.02]" : "border-white/10 hover:border-[#0EA5E9]/30"}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0C1E2E]/90 to-[#0A0E1A]/90" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0EA5E9]/80 to-transparent" />
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#0EA5E9]/15 blur-[40px] rounded-full pointer-events-none" />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[12px] bg-[#0EA5E9] flex items-center justify-center text-white font-black text-[13px] shadow-[0_0_15px_rgba(14,165,233,0.45)]">G</div>
                  <div>
                    <div className="orbitron text-[11px] font-bold tracking-[0.15em]">GCASH #2</div>
                    <div className="mono text-[10px] text-white/50">SH*N J • Backup</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 mono text-[9px] tracking-widest text-[#BAE6FD]">CYAN • ACTIVE</span>
              </div>

              <div className="rounded-[20px] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="mono text-[9px] font-bold tracking-widest text-[#0EA5E9]">GCASH QR • +63 966 490 • SH*N J</span>
                  <span className="mono text-[8px] px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] border border-[#0EA5E9]/20">QR 2</span>
                </div>
                <div className="aspect-square w-full bg-white rounded-[14px] overflow-hidden border border-black/[0.06] relative">
                  <img src={gcash2Url} alt="GCash QR 09664903825 SH*N J +63 966 490 3825 - pixel perfect scannable" className="w-full h-full object-contain block" />
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
                    <div className="absolute inset-x-0 h-[40%] bg-gradient-to-b from-[#0EA5E9] to-transparent" style={{ animation: 'scanline 2.8s linear infinite' }} />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="mono text-[10px] text-black/60">Name: <span className="font-bold text-black">SH*N J</span> ✓ Verified</div>
                    <div className="mono text-[8px] px-1.5 py-0.5 rounded bg-black/5 text-black/50">InstaPay</div>
                  </div>
                  <div className="rounded-[12px] bg-[#F0F9FF] border border-[#BAE6FD] px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <div className="mono text-[8px] tracking-widest text-[#0369A1]/70">GCASH NUMBER</div>
                      <div className="mono text-[18px] font-black tracking-wider text-[#0C4A6E]">09664903825</div>
                      <div className="mono text-[9px] text-black/50 mt-0.5">+63 966 490 3825 • SH*N J</div>
                    </div>
                    <button onClick={() => copy("09664903825", "g2-card")} className={`h-9 px-4 rounded-full mono text-[11px] font-bold tracking-widest transition ${copiedId === "g2-card" ? "bg-[#00C853] text-black" : "bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-[0_0_15px_rgba(14,165,233,0.35)]"}`}>
                      {copiedId === "g2-card" ? "✓ COPIED" : "COPY"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 mono text-[10px] text-[#BAE6FD]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse" />
                Backup channel • Same verification SH*N J
              </div>
            </div>
          </div>
        </div>

        {/* HOW TO PAY + AFTER PAYMENT + RECEIPT */}
        <div className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* LEFT: How to pay + After Payment */}
          <div className="space-y-6">
            {/* HOW TO PAY */}
            <div className="rounded-[20px] bg-[#10192B]/70 backdrop-blur-xl border border-[#007DFE]/20 p-5 md:p-6 shadow-[0_0_40px_rgba(0,125,254,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#007DFE] via-[#38BDF8] to-[#007DFE] opacity-70" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#007DFE]/15 border border-[#007DFE]/30 flex items-center justify-center">⚙️</div>
                <h3 className="orbitron font-bold text-[13px] tracking-widest">HOW TO PAY - 3 STEPS</h3>
                <span className="ml-auto hidden md:flex mono text-[9px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">FINTECH SECURE FLOW</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { n: "01", t: "SCAN QR", d: "Choose BPI 8119903131 or GCash 09999690008 / 09664903825. Scan QR with your banking app.", icon: "📲", c: "border-[#007DFE]/20 from-[#007DFE]/10 to-transparent" },
                  { n: "02", t: "ENTER AMOUNT", d: "Input your monthly plan amount. Confirm receiver: LOYS BPI for BPI, SH*N J for GCash.", icon: "💳", c: "border-[#38BDF8]/20 from-[#38BDF8]/10 to-transparent" },
                  { n: "03", t: "SCREENSHOT RECEIPT", d: "Save transaction screenshot with Reference No. Send to FB / Email / Tel for instant confirmation.", icon: "📸", c: "border-[#00C853]/20 from-[#00C853]/10 to-transparent" },
                ].map((s) => (
                  <div key={s.n} className={`rounded-[16px] bg-gradient-to-b ${s.c} border p-4 relative overflow-hidden`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[14px]">{s.icon}</div>
                      <span className="mono text-[16px] font-black text-white/20">{s.n}</span>
                    </div>
                    <div className="orbitron text-[11px] font-bold tracking-widest text-white">{s.t}</div>
                    <div className="mono text-[11px] leading-[1.5] text-white/55 mt-2">{s.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER PAYMENT - HIGH VISIBILITY */}
            <div className="rounded-[24px] overflow-hidden border border-[#38BDF8]/25 bg-gradient-to-br from-[#0F1D32]/90 to-[#0A0E1A]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(0,125,254,0.18),0_0_50px_rgba(56,189,248,0.10)] relative">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#007DFE] via-[#38BDF8] to-[#00C853] opacity-90" />
              <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] bg-[#007DFE]/12 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-[300px] h-[300px] bg-[#38BDF8]/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="p-6 md:p-7 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C853]/10 border border-[#00C853]/30 mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                      <span className="orbitron text-[10px] font-bold tracking-[0.18em] text-[#69F0AE]">ACTION REQUIRED • AFTER PAYMENT</span>
                    </div>
                    <h2 className="orbitron font-black text-[18px] md:text-[21px] leading-[1.1] tracking-tight">
                      PLEASE SEND RECEIPT /<br />TRANSACTION TO:
                    </h2>
                    <p className="mono text-[11.5px] text-white/50 mt-2 max-w-[520px]">For instant verification (BPI or GCash), send screenshot with Reference No. to any channel below. Response 5-15 mins during business hours.</p>
                  </div>
                  <div className="hidden md:flex w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#007DFE] to-[#38BDF8] items-center justify-center shadow-[0_0_20px_rgba(0,125,254,0.4)] text-[22px]">📨</div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-3">
                  <div className="group flex items-center gap-4 p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-[#1877F2]/40 transition">
                    <div className="w-11 h-11 rounded-[12px] bg-[#1877F2] flex items-center justify-center text-white font-black text-[18px] shadow-[0_0_15px_rgba(24,119,242,0.4)]">f</div>
                    <div className="flex-1 min-w-0">
                      <div className="mono text-[9px] tracking-widest text-white/40">FACEBOOK PERSONAL</div>
                      <div className="font-bold text-[13px] tracking-tight truncate">LOY LADROMA JALA</div>
                      <div className="mono text-[10px] text-white/40 mt-0.5">Messenger Preferred</div>
                    </div>
                    <a href="https://m.me/" target="_blank" rel="noopener" className="shrink-0 h-8 px-3 rounded-full bg-[#1877F2] text-white mono text-[10px] font-bold tracking-widest hover:bg-[#166FE5] transition">MESSAGE</a>
                  </div>

                  <div className="group flex items-center gap-4 p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-[#007DFE]/40 transition">
                    <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-[#007DFE] to-[#38BDF8] flex items-center justify-center text-white font-black text-[11px] shadow-[0_0_15px_rgba(0,125,254,0.4)]">PAGE</div>
                    <div className="flex-1 min-w-0">
                      <div className="mono text-[9px] tracking-widest text-white/40">FACEBOOK PAGE</div>
                      <div className="font-bold text-[11px] leading-tight">LOY'S PISOWIFI COMPUTER DIGITAL SERVICES</div>
                      <div className="mono text-[10px] text-white/40 mt-0.5">Official Business Page</div>
                    </div>
                    <a href="https://facebook.com" target="_blank" rel="noopener" className="shrink-0 h-8 px-3 rounded-full bg-white text-black mono text-[10px] font-bold tracking-widest hover:bg-white/90 transition">VISIT</a>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-[#00C853]/30 transition">
                    <div className="w-11 h-11 rounded-[12px] bg-white text-black flex items-center justify-center text-[18px]">✉️</div>
                    <div className="flex-1 min-w-0">
                      <div className="mono text-[9px] tracking-widest text-white/40">EMAIL</div>
                      <div className="font-bold text-[12px] mono truncate">slasherloy@gmail.com</div>
                      <div className="mono text-[10px] text-white/40 mt-0.5">Attach receipt screenshot</div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <a href="mailto:slasherloy@gmail.com?subject=LOY'S%20Fibernetworks%20Payment%20Receipt" className="h-8 px-3 rounded-full bg-[#00C853] text-black mono text-[10px] font-bold tracking-widest hover:bg-[#00C853]/90 transition flex items-center justify-center">SEND EMAIL</a>
                      <button onClick={() => copy("slasherloy@gmail.com", "email")} className="h-7 px-3 rounded-full bg-white/[0.06] border border-white/10 mono text-[9px] tracking-widest hover:bg-white/[0.10] transition">{copiedId === "email" ? "✓ COPIED" : "COPY EMAIL"}</button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-[16px] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-[#38BDF8]/30 transition">
                    <div className="w-11 h-11 rounded-[12px] bg-[#38BDF8]/15 border border-[#38BDF8]/25 flex items-center justify-center text-[18px]">📞</div>
                    <div className="flex-1 min-w-0">
                      <div className="mono text-[9px] tracking-widest text-white/40">TELEPHONE / LANDLINE</div>
                      <div className="font-bold text-[13px] mono tracking-wide">(038) 411-0774</div>
                      <div className="mono text-[10px] text-white/40 mt-0.5">Office Hours</div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <a href="tel:0384110774" className="h-8 px-3 rounded-full bg-[#38BDF8] text-black mono text-[10px] font-bold tracking-widest hover:bg-[#0EA5E9] transition flex items-center justify-center">CALL</a>
                      <button onClick={() => copy("(038) 411-0774", "tel")} className="h-7 px-3 rounded-full bg-white/[0.06] border border-white/10 mono text-[9px] tracking-widest hover:bg-white/[0.10] transition">{copiedId === "tel" ? "✓ COPIED" : "COPY TEL"}</button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[12px] bg-black/30 border border-[#38BDF8]/15 p-3.5 flex gap-3">
                  <span className="text-[16px] shrink-0">💡</span>
                  <p className="mono text-[11px] leading-[1.6] text-white/60">Include: <span className="text-white font-bold">Customer Name, Date Paid, Amount, Reference No., and which channel you used (BPI 8119903131 / GCash 09999690008 / 09664903825)</span>. Keep screenshot until confirmed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Receipt logger */}
          <div className="rounded-[24px] border border-white/10 bg-[#111827]/60 backdrop-blur-xl p-5 md:p-6 h-fit lg:sticky lg:top-[112px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="orbitron font-bold text-[12px] tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_6px_#38BDF8]" />
                RECEIPT LOGGER
              </h3>
              <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">{receipts.length} saved</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="mono text-[10px] tracking-widest text-white/50 mb-1.5 block">CUSTOMER NAME *</label>
                <input value={form.payerName} onChange={e => setForm({ ...form, payerName: e.target.value })} placeholder="e.g. Juan Dela Cruz" className="w-full h-11 rounded-[12px] bg-black/40 border border-white/10 px-4 text-[13px] focus:border-[#38BDF8] outline-none transition placeholder:text-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono text-[10px] tracking-widest text-white/50 mb-1.5 block">AMOUNT PAID *</label>
                  <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="₱ 1,000" className="w-full h-11 rounded-[12px] bg-black/40 border border-white/10 px-4 text-[13px] focus:border-[#00C853] outline-none transition placeholder:text-white/30" />
                </div>
                <div>
                  <label className="mono text-[10px] tracking-widest text-white/50 mb-1.5 block">REFERENCE NO *</label>
                  <input value={form.refNo} onChange={e => setForm({ ...form, refNo: e.target.value })} placeholder="e.g. 9123456789012" className="w-full h-11 rounded-[12px] bg-black/40 border border-white/10 px-4 text-[13px] mono focus:border-[#38BDF8] outline-none transition placeholder:text-white/30" />
                </div>
              </div>
              <div>
                <label className="mono text-[10px] tracking-widest text-white/50 mb-1.5 block">ACCOUNT USED</label>
                <select value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} className="w-full h-11 rounded-[12px] bg-black/40 border border-white/10 px-4 text-[13px] focus:border-[#007DFE] outline-none transition">
                  <option>BPI 8119903131 - LOYS BPI</option>
                  <option>GCash 09999690008 - SH*N J Account 1</option>
                  <option>GCash 09664903825 - SH*N J Account 2</option>
                </select>
              </div>
              <div>
                <label className="mono text-[10px] tracking-widest text-white/50 mb-1.5 block">CONTACT / FB (OPTIONAL)</label>
                <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="FB name or mobile" className="w-full h-11 rounded-[12px] bg-black/40 border border-white/10 px-4 text-[13px] focus:border-[#007DFE] outline-none transition placeholder:text-white/30" />
              </div>

              <button disabled={submitting} type="submit" className="w-full h-12 rounded-full bg-gradient-to-r from-[#007DFE] to-[#38BDF8] hover:from-[#0063CB] hover:to-[#0EA5E9] disabled:opacity-50 transition orbitron font-bold text-[11px] tracking-[0.14em] shadow-[0_0_24px_rgba(0,125,254,0.35)] text-white">
                {submitting ? "SAVING..." : "SUBMIT RECEIPT → DATABASE"}
              </button>

              {msg && <div className="rounded-[12px] bg-[#10192B] border border-[#38BDF8]/20 p-3 mono text-[11px] leading-[1.5] text-white/80">{msg}</div>}

              <p className="mono text-[10px] text-white/35 text-center leading-[1.4]">Saved locally to portal database for tracking. You must still send screenshot to FB / Email / Tel above for official verification.</p>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="mono text-[10px] tracking-widest text-white/40">RECENT RECEIPTS</div>
                <button onClick={load} className="mono text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">REFRESH</button>
              </div>
              {loadingRecords ? (
                <div className="mono text-[11px] text-white/40">Loading records...</div>
              ) : receipts.length === 0 ? (
                <div className="rounded-[12px] bg-black/30 border border-dashed border-white/10 p-4 text-center">
                  <div className="mono text-[11px] text-white/30">No receipts logged yet.</div>
                  <div className="mono text-[10px] text-white/20 mt-1">Your submissions will appear here.</div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-auto pr-1 custom-scroll">
                  {receipts.slice(0, 12).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-[12px] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition">
                      <div className="min-w-0">
                        <div className="font-bold text-[12px] truncate">{r.value.payerName} <span className="font-normal text-white/50">• {r.value.amount}</span></div>
                        <div className="mono text-[10px] text-white/40 mt-1 truncate max-w-[210px]">{r.value.account} • {r.value.refNo.slice(0, 16)}...</div>
                      </div>
                      <div className="mono text-[9px] text-white/30 shrink-0 ml-3">{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECURITY FOOTER STRIP */}
        <div className="mt-10 rounded-[16px] bg-gradient-to-r from-[#0F1D32]/80 via-[#10192B]/80 to-[#0F1D32]/80 border border-[#007DFE]/15 backdrop-blur-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-center md:justify-start">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20">
              <span className="w-4 h-4 rounded-full bg-[#00C853]/20 flex items-center justify-center text-[10px]">🔒</span>
              <span className="mono text-[10px] font-bold tracking-widest text-[#69F0AE]">100% SECURE • ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#007DFE]/10 border border-[#007DFE]/20">
              <span className="w-4 h-4 rounded-full bg-[#007DFE]/20 flex items-center justify-center text-[10px]">⚡</span>
              <span className="mono text-[10px] font-bold tracking-widest text-[#7DD3FC]">INSTAPAY VERIFIED • INSTANT</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20">
              <span className="w-4 h-4 rounded-full bg-[#38BDF8]/20 flex items-center justify-center text-[10px]">🌐</span>
              <span className="mono text-[10px] font-bold tracking-widest text-[#BAE6FD]">FIBER FAST • BOHOL WIDE</span>
            </div>
          </div>
          <div className="mono text-[10px] text-white/30 text-center md:text-right">Official channels only: SH*N J GCash + BPI 8119903131 LOYS BPI • Verify name before paying</div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative rounded-[12px] bg-white p-1.5 shadow-[0_0_20px_rgba(0,125,254,0.18)] shrink-0">
                <img src={logoUrl} alt="Loy's Fibernetworks logo" className="w-[68px] h-auto rounded-[8px] object-contain block" />
              </div>
              <div>
                <div className="orbitron font-black text-[12px] tracking-widest leading-tight">LOY'S FIBERNETWORKS - CONNECTING BOHOL FASTER</div>
                <div className="mono text-[11px] text-white/50 mt-0.5">San Isidro, Bilar & Carmen, Bohol • IT Solutions</div>
                <div className="mono text-[10px] text-[#7DD3FC]/70 mt-1">BPI LOYS BPI 8119903131 • GCash SH*N J 09999690008 / 09664903825 • InstaPay</div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-2 mono text-[10px] tracking-widest text-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
                ALL SYSTEMS OPERATIONAL • OFFICIAL LOGO VERIFIED • READY FOR FB SHARE
              </div>
              <div className="flex items-center gap-2">
                <span className="mono text-[9px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">SSL SECURE</span>
                <span className="mono text-[9px] px-2 py-1 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#FCA5A5]">BPI VERIFIED</span>
                <span className="mono text-[9px] px-2 py-1 rounded-full bg-[#007DFE]/10 border border-[#007DFE]/20 text-[#7DD3FC]">GCASH VERIFIED</span>
                <span className="mono text-[9px] px-2 py-1 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-[#69F0AE]">© 2025 OFFICIAL</span>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-[14px] bg-[#10192B]/60 border border-white/5 p-4">
            <p className="mono text-[10.5px] leading-[1.6] text-white/35 text-center">© 2025 LOY'S FIBERNETWORKS IT SOLUTIONS. Official payment accounts only: BPI 8119903131 (LOYS BPI), GCash 09999690008 (SH*N J +63 999 969) & 09664903825 (SH*N J +63 966 490). All QR codes are pixel-perfect and scannable. Verify account name before transferring. Beware of fake QR codes. Designed as premium fintech portal for Facebook posting and print. Fiber optic infrastructure serving San Isidro, Bilar & Carmen, Bohol.</p>
          </div>
        </footer>
      </main>

      <div className="pointer-events-none fixed bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#007DFE]/12 blur-[130px] rounded-full -z-10" />
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] bg-[#38BDF8]/08 blur-[130px] rounded-full -z-10" />
    </div>
  );
}
