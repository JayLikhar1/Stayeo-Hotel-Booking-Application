import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Wallet, CreditCard, FileText, TrendingUp,
  MapPin, Calendar, Clock, Award, Plus, Trash2, Shield,
  RefreshCw, Download, ChevronRight, CheckCircle, AlertCircle,
  Hotel, Gift, IndianRupee, BarChart3, Globe, Zap, Lock,
  Wifi, WifiOff
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { useUserDashboard } from "../hooks/useUserDashboard";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const TIER_COLORS = {
  Bronze:   "from-amber-700 to-yellow-600",
  Silver:   "from-slate-400 to-gray-300",
  Gold:     "from-yellow-500 to-amber-400",
  Platinum: "from-violet-500 to-purple-400",
};
const TIER_GLOW = {
  Bronze:   "shadow-[0_0_20px_rgba(180,83,9,0.4)]",
  Silver:   "shadow-[0_0_20px_rgba(148,163,184,0.4)]",
  Gold:     "shadow-[0_0_20px_rgba(234,179,8,0.4)]",
  Platinum: "shadow-[0_0_20px_rgba(124,58,237,0.5)]",
};

const CURRENCIES = [
  { code: "INR", symbol: "₹",   rate: 1       },
  { code: "USD", symbol: "$",   rate: 0.012   },
  { code: "EUR", symbol: "€",   rate: 0.011   },
  { code: "GBP", symbol: "£",   rate: 0.0095  },
  { code: "AED", symbol: "د.إ", rate: 0.044   },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const TabBtn = ({ active, onClick, icon: Icon, label, badge }) => (
  <button onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
      active ? "bg-violet-600 text-white shadow-glow-sm" : "text-white/50 hover:text-white hover:bg-white/5"
    }`}>
    <Icon className="w-4 h-4" />
    {label}
    {badge !== undefined && badge > 0 && (
      <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">{badge}</span>
    )}
  </button>
);

const SectionCard = ({ title, icon: Icon, iconColor = "text-violet-400", children, action }) => (
  <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
    className="glass rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

// Animated number that slides when value changes
const LiveNumber = ({ value, className = "" }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0.3, y: -8 }}
    animate={{ opacity: 1,   y: 0  }}
    transition={{ duration: 0.35 }}
    className={className}>
    {value}
  </motion.span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const UserDashboard = () => {
  const { user } = useAuthStore();
  const { success, error } = useToastStore();
  const token = localStorage.getItem("stayeo_token");

  // ── Real-time hook (HTTP + SSE merged) ────────────────────────────
  const { data, isLoading, isConnected, lastUpdated, refresh } = useUserDashboard(token);
  const d = data || {};

  const [tab, setTab]           = useState("overview");
  const [currency, setCurrency] = useState("INR");

  // Wallet
  const [walletAmt, setWalletAmt]       = useState("");
  const [addingWallet, setAddingWallet] = useState(false);

  // Loyalty redeem
  const [redeemPts, setRedeemPts]   = useState("");
  const [redeeming, setRedeeming]   = useState(false);

  // Document form
  const [docForm, setDocForm]       = useState({ docType: "Passport", docNumber: "", name: "", expiry: "", nationality: "Indian" });
  const [addingDoc, setAddingDoc]   = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);

  // Payment method form
  const [pmForm, setPmForm]         = useState({ type: "card", label: "", last4: "", network: "Visa", upiId: "", isDefault: false });
  const [addingPm, setAddingPm]     = useState(false);
  const [showPmForm, setShowPmForm] = useState(false);

  // Refund
  const [refunding, setRefunding]   = useState(null);

  const cur  = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const conv = (n) => cur.symbol + (Number(n || 0) * cur.rate).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // ── Wallet top-up ──────────────────────────────────────────────────
  const handleWalletAdd = async (e) => {
    e.preventDefault();
    if (!walletAmt || walletAmt < 100) return error("Minimum top-up is ₹100");
    setAddingWallet(true);
    try {
      const res = await dashboardAPI.addToWallet(Number(walletAmt));
      success(res.data.message);
      setWalletAmt("");
      // SSE will auto-update; refresh as fallback
      setTimeout(refresh, 500);
    } catch (e) { error(e.response?.data?.message || "Failed"); }
    finally { setAddingWallet(false); }
  };

  // ── Loyalty redeem ─────────────────────────────────────────────────
  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!redeemPts || redeemPts < 100) return error("Minimum 100 points");
    setRedeeming(true);
    try {
      const res = await dashboardAPI.redeemPoints(Number(redeemPts));
      success(res.data.message);
      setRedeemPts("");
    } catch (e) { error(e.response?.data?.message || "Failed"); }
    finally { setRedeeming(false); }
  };

  // ── Add document ───────────────────────────────────────────────────
  const handleAddDoc = async (e) => {
    e.preventDefault();
    setAddingDoc(true);
    try {
      const res = await dashboardAPI.addDocument(docForm);
      success(res.data.message);
      setShowDocForm(false);
      setDocForm({ docType: "Passport", docNumber: "", name: "", expiry: "", nationality: "Indian" });
    } catch (e) { error(e.response?.data?.message || "Failed"); }
    finally { setAddingDoc(false); }
  };

  const handleDeleteDoc = async (id) => {
    try { await dashboardAPI.deleteDocument(id); success("Document removed"); }
    catch { error("Failed to remove"); }
  };

  // ── Payment method ─────────────────────────────────────────────────
  const handleAddPm = async (e) => {
    e.preventDefault();
    setAddingPm(true);
    try {
      const res = await dashboardAPI.addPaymentMethod(pmForm);
      success(res.data.message);
      setShowPmForm(false);
      setPmForm({ type: "card", label: "", last4: "", network: "Visa", upiId: "", isDefault: false });
    } catch (e) { error(e.response?.data?.message || "Failed"); }
    finally { setAddingPm(false); }
  };

  const handleDeletePm = async (id) => {
    try { await dashboardAPI.deletePaymentMethod(id); success("Payment method removed"); }
    catch { error("Failed to remove"); }
  };

  // ── Refund ─────────────────────────────────────────────────────────
  const handleRefund = async (bookingId) => {
    setRefunding(bookingId);
    try {
      const res = await dashboardAPI.processRefund(bookingId);
      success(res.data.message);
    } catch (e) { error(e.response?.data?.message || "Refund failed"); }
    finally { setRefunding(null); }
  };

  // ── Invoice ────────────────────────────────────────────────────────
  const handleInvoice = async (bookingId) => {
    try {
      const res = await dashboardAPI.getInvoice(bookingId);
      const inv = res.data.invoice;
      const html = `<!DOCTYPE html><html><head><title>Invoice ${inv.invoiceNumber}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;color:#111}h1{color:#7c3aed}
      table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:10px;border:1px solid #ddd;text-align:left}
      th{background:#f5f5f5}.total{font-weight:bold;color:#7c3aed}</style></head>
      <body><h1>StayEo</h1><p>${inv.company?.address}</p><p>GSTIN: ${inv.company?.gstin}</p>
      <h2>TAX INVOICE — ${inv.invoiceNumber}</h2>
      <p>Date: ${new Date(inv.invoiceDate).toLocaleDateString("en-IN")}</p>
      <h3>Bill To</h3><p>${inv.guest?.name}<br/>${inv.guest?.email}</p>
      <table><tr><th>Description</th><th>Nights</th><th>Rate/Night</th><th>Amount</th></tr>
      <tr><td>${inv.hotel?.name} — ${inv.roomType}</td><td>${inv.nights}</td>
      <td>₹${Number(inv.pricePerNight).toLocaleString("en-IN")}</td>
      <td>₹${Number(inv.subtotal).toLocaleString("en-IN")}</td></tr></table>
      <table><tr><td>Subtotal</td><td>₹${Number(inv.subtotal).toLocaleString("en-IN")}</td></tr>
      <tr><td>CGST (9%)</td><td>₹${Number(inv.cgst).toLocaleString("en-IN")}</td></tr>
      <tr><td>SGST (9%)</td><td>₹${Number(inv.sgst).toLocaleString("en-IN")}</td></tr>
      <tr class="total"><td><b>Total</b></td><td><b>₹${Number(inv.totalAmount).toLocaleString("en-IN")}</b></td></tr></table>
      <p>Payment ID: ${inv.paymentId || "N/A"}</p></body></html>`;
      const w = window.open("", "_blank");
      w.document.write(html);
      w.document.close();
      w.print();
    } catch { error("Failed to generate invoice"); }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-24 section-container">
      <div className="skeleton h-10 w-64 rounded mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="section-container">

        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pt-6">
          <div>
            <h1 className="text-2xl font-black text-white">My Dashboard</h1>
            <div className="flex items-center gap-3 mt-1">
              {/* Live indicator */}
              <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                isConnected
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/15 text-red-400 border-red-500/20"
              }`}>
                {isConnected
                  ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</>
                  : <><WifiOff className="w-3 h-3" /> Offline</>
                }
              </div>
              {lastUpdated && (
                <p className="text-white/30 text-xs">
                  Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Today's live spending pill */}
            {d.todaySpent > 0 && (
              <motion.div key={d.todaySpent} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                className="glass px-4 py-2 rounded-xl border border-violet-500/20 bg-violet-500/5">
                <p className="text-[10px] text-white/30 leading-none mb-0.5">Today&apos;s Spending</p>
                <p className="text-sm font-black gradient-text">{fmt(d.todaySpent)}</p>
              </motion.div>
            )}
            {/* Currency selector */}
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              className="glass text-white/60 text-sm px-3 py-2 rounded-xl focus:outline-none">
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code} className="bg-dark-900">{c.code} {c.symbol}</option>
              ))}
            </select>
            <button onClick={refresh}
              className="glass px-3 py-2 rounded-xl text-white/50 hover:text-white transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ── Tab Nav ─────────────────────────────────────────────── */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar glass rounded-xl p-1 mb-8">
          {[
            { id: "overview",  icon: BarChart3,  label: "Overview" },
            { id: "loyalty",   icon: Award,      label: "Loyalty",   badge: d.loyaltyPoints },
            { id: "wallet",    icon: Wallet,      label: "Wallet" },
            { id: "payments",  icon: CreditCard, label: "Payments",  badge: d.savedPaymentMethods?.length },
            { id: "documents", icon: FileText,    label: "Documents", badge: d.travelDocuments?.length },
            { id: "trips",     icon: Calendar,   label: "Trips",     badge: d.upcomingCount },
            { id: "spending",  icon: TrendingUp, label: "Spending" },
          ].map(t => <TabBtn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} {...t} />)}
        </div>

        {/* ══════════════════════════════════════════════════════════
            OVERVIEW TAB
        ══════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* KPI row — all values animate on SSE update */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Spent",    value: conv(d.totalSpent),    icon: IndianRupee, color: "from-violet-500 to-purple-600", live: true },
                { label: "Bookings",       value: d.totalBookings || 0,  icon: Hotel,       color: "from-blue-500 to-cyan-600",    live: true },
                { label: "Cities Visited", value: d.citiesCount || 0,    icon: Globe,       color: "from-emerald-500 to-teal-600", live: true },
                { label: "Loyalty Points", value: (d.loyaltyPoints || 0).toLocaleString("en-IN"), icon: Award, color: "from-amber-500 to-orange-500", live: true },
              ].map((k, i) => (
                <motion.div key={k.label} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                  className="glass rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
                  <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${k.color} opacity-10 blur-xl`} />
                  {k.live && isConnected && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <k.icon className="w-5 h-5 text-white" />
                  </div>
                  <LiveNumber value={k.value} className="text-xl font-black text-white block" />
                  <p className="text-xs text-white/40 mt-0.5">{k.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Loyalty tier card */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className={`glass rounded-2xl p-6 relative overflow-hidden ${TIER_GLOW[d.loyaltyTier] || ""}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${TIER_COLORS[d.loyaltyTier] || "from-violet-500 to-purple-600"} opacity-5`} />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${TIER_COLORS[d.loyaltyTier] || "from-violet-500 to-purple-600"} flex items-center justify-center shadow-glow-sm`}>
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Current Tier</p>
                    <LiveNumber value={d.loyaltyTier || "Bronze"} className="text-2xl font-black text-white block" />
                    <p className="text-sm text-white/50">
                      <LiveNumber value={(d.loyaltyPoints || 0).toLocaleString("en-IN")} /> points
                    </p>
                  </div>
                </div>
                {d.nextTier && (
                  <div className="flex-1 max-w-xs">
                    <div className="flex justify-between text-xs text-white/40 mb-1.5">
                      <span>{d.loyaltyTier}</span>
                      <span>{d.nextTier} at {(d.nextThreshold || 0).toLocaleString("en-IN")} pts</span>
                    </div>
                    <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                      <motion.div
                        key={d.progressPct}
                        initial={{ width: 0 }}
                        animate={{ width: `${d.progressPct || 0}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${TIER_COLORS[d.loyaltyTier] || "from-violet-500 to-purple-600"} rounded-full`}
                      />
                    </div>
                    <p className="text-xs text-white/30 mt-1">{d.progressPct || 0}% to {d.nextTier}</p>
                  </div>
                )}
                <button onClick={() => setTab("loyalty")}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Upcoming trips */}
            {(d.upcomingBookings || []).length > 0 && (
              <SectionCard title="Upcoming Trips" icon={Calendar} iconColor="text-blue-400"
                action={<Link to="/my-bookings" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</Link>}>
                <div className="space-y-3">
                  {d.upcomingBookings.map((b, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-dark-800/50 rounded-xl">
                      {b.hotel?.thumbnail && (
                        <img src={b.hotel.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          onError={e => e.target.style.display = "none"} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.hotel?.name}</p>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{b.hotel?.location?.city}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                          {new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} →{" "}
                          {new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-lg font-black ${b.daysUntil <= 3 ? "text-red-400" : b.daysUntil <= 7 ? "text-amber-400" : "gradient-text"}`}>
                          {b.daysUntil}d
                        </div>
                        <p className="text-[10px] text-white/30">to go</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Wallet + quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SectionCard title="Wallet Balance" icon={Wallet} iconColor="text-emerald-400"
                action={<button onClick={() => setTab("wallet")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Top Up</button>}>
                <LiveNumber value={fmt(d.walletBalance)} className="text-3xl font-black gradient-text block mb-1" />
                <p className="text-xs text-white/40">Available balance</p>
                {isConnected && <p className="text-[10px] text-emerald-400/60 mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Updates in real-time</p>}
              </SectionCard>
              <SectionCard title="Quick Stats" icon={BarChart3} iconColor="text-violet-400">
                <div className="space-y-2">
                  {[
                    { label: "This month spent",  value: conv(d.thisMonthSpent) },
                    { label: "Avg per booking",   value: conv(d.avgPerBooking) },
                    { label: "Completed stays",   value: d.completedCount || 0 },
                    { label: "Points earned",     value: (d.totalPointsEarned || 0).toLocaleString("en-IN") },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between text-sm">
                      <span className="text-white/50">{s.label}</span>
                      <LiveNumber value={s.value} className="font-semibold text-white" />
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            LOYALTY TAB
        ══════════════════════════════════════════════════════════ */}
        {tab === "loyalty" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className={`glass rounded-2xl p-6 relative overflow-hidden ${TIER_GLOW[d.loyaltyTier] || ""}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${TIER_COLORS[d.loyaltyTier] || "from-violet-500 to-purple-600"} opacity-5`} />
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { label: "Current Tier",   value: d.loyaltyTier || "Bronze" },
                  { label: "Points Balance", value: (d.loyaltyPoints || 0).toLocaleString("en-IN") },
                  { label: "Total Earned",   value: (d.totalPointsEarned || 0).toLocaleString("en-IN") },
                  { label: "Cash Value",     value: fmt(Math.floor((d.loyaltyPoints || 0) / 100) * 10) },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <LiveNumber value={s.value} className="text-2xl font-black gradient-text block" />
                    <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              {d.nextTier && (
                <div className="relative mt-5">
                  <div className="flex justify-between text-xs text-white/40 mb-1.5">
                    <span>{d.loyaltyTier} ({(d.loyaltyPoints || 0).toLocaleString("en-IN")} pts)</span>
                    <span>{d.nextTier} ({(d.nextThreshold || 0).toLocaleString("en-IN")} pts)</span>
                  </div>
                  <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div key={d.progressPct} initial={{ width: 0 }} animate={{ width: `${d.progressPct || 0}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${TIER_COLORS[d.loyaltyTier] || "from-violet-500 to-purple-600"} rounded-full`} />
                  </div>
                </div>
              )}
            </div>

            <SectionCard title="Redeem Points" icon={Gift} iconColor="text-amber-400">
              <p className="text-sm text-white/50 mb-4">100 points = ₹10 wallet credit. Minimum: 100 points.</p>
              <form onSubmit={handleRedeem} className="flex gap-3">
                <input type="number" value={redeemPts} onChange={e => setRedeemPts(e.target.value)}
                  placeholder="Points to redeem (min 100)" min={100} max={d.loyaltyPoints}
                  className="input-dark text-sm flex-1" />
                <button type="submit" disabled={redeeming}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50 flex-shrink-0">
                  {redeeming ? "..." : "Redeem"}
                </button>
              </form>
              {redeemPts >= 100 && (
                <p className="text-xs text-emerald-400 mt-2">
                  You will receive {fmt(Math.floor(redeemPts / 100) * 10)} in wallet credit
                </p>
              )}
            </SectionCard>

            <SectionCard title="Points History" icon={Clock} iconColor="text-violet-400">
              {(d.pointsHistory || []).length > 0 ? (
                <div className="space-y-2">
                  {d.pointsHistory.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-sm text-white/70">{h.description}</p>
                        <p className="text-xs text-white/30">{new Date(h.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span className={`text-sm font-bold ${h.points > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {h.points > 0 ? "+" : ""}{h.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-white/30 text-sm text-center py-6">No points history yet. Make a booking to earn points!</p>}
            </SectionCard>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            WALLET TAB
        ══════════════════════════════════════════════════════════ */}
        {tab === "wallet" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="glass rounded-2xl p-8 text-center relative overflow-hidden shadow-glow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
              {isConnected && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </div>
              )}
              <Wallet className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-xs text-white/40 mb-1">Available Balance</p>
              <LiveNumber value={fmt(d.walletBalance)} className="text-4xl font-black gradient-text block" />
              {currency !== "INR" && (
                <p className="text-sm text-white/30 mt-1">≈ {conv(d.walletBalance)}</p>
              )}
            </div>

            <SectionCard title="Add Money to Wallet" icon={Plus} iconColor="text-emerald-400">
              <div className="flex flex-wrap gap-2 mb-4">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} onClick={() => setWalletAmt(String(amt))}
                    className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                      walletAmt === String(amt) ? "bg-violet-600 border-violet-500 text-white" : "border-white/10 text-white/50 hover:border-white/20"
                    }`}>
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              <form onSubmit={handleWalletAdd} className="flex gap-3">
                <input type="number" value={walletAmt} onChange={e => setWalletAmt(e.target.value)}
                  placeholder="Enter amount (₹100 – ₹50,000)" min={100} max={50000}
                  className="input-dark text-sm flex-1" />
                <button type="submit" disabled={addingWallet}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50 flex-shrink-0">
                  {addingWallet ? "Adding..." : "Add Money"}
                </button>
              </form>
              <p className="text-xs text-white/30 mt-2">Powered by Razorpay · Instant credit · No charges</p>
            </SectionCard>

            <SectionCard title="Transaction History" icon={Clock} iconColor="text-violet-400">
              {(d.walletTransactions || []).length > 0 ? (
                <div className="space-y-2">
                  {d.walletTransactions.map((t, i) => {
                    const isCredit = ["CREDIT","REFUND","CASHBACK"].includes(t.type);
                    return (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCredit ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                            {isCredit ? <Plus className="w-4 h-4 text-emerald-400" /> : <IndianRupee className="w-4 h-4 text-red-400" />}
                          </div>
                          <div>
                            <p className="text-sm text-white/70">{t.description}</p>
                            <p className="text-xs text-white/30">{new Date(t.createdAt).toLocaleDateString("en-IN")}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
                          {isCredit ? "+" : "-"}{fmt(t.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-white/30 text-sm text-center py-6">No transactions yet</p>}
            </SectionCard>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            PAYMENTS TAB
        ══════════════════════════════════════════════════════════ */}
        {tab === "payments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <SectionCard title="Saved Payment Methods" icon={CreditCard} iconColor="text-blue-400"
              action={<button onClick={() => setShowPmForm(!showPmForm)} className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"><Plus className="w-3.5 h-3.5" /> Add New</button>}>
              <AnimatePresence>
                {showPmForm && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} onSubmit={handleAddPm}
                    className="overflow-hidden mb-5 pb-5 border-b border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Type</label>
                        <select value={pmForm.type} onChange={e => setPmForm(f => ({ ...f, type: e.target.value }))} className="input-dark text-sm">
                          {["card","upi","netbanking"].map(t => <option key={t} value={t} className="bg-dark-900">{t.toUpperCase()}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Label</label>
                        <input value={pmForm.label} onChange={e => setPmForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. HDFC Debit" className="input-dark text-sm" />
                      </div>
                    </div>
                    {pmForm.type === "card" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-white/50 mb-1">Last 4 digits</label>
                          <input value={pmForm.last4} onChange={e => setPmForm(f => ({ ...f, last4: e.target.value }))} placeholder="4242" maxLength={4} className="input-dark text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs text-white/50 mb-1">Network</label>
                          <select value={pmForm.network} onChange={e => setPmForm(f => ({ ...f, network: e.target.value }))} className="input-dark text-sm">
                            {["Visa","Mastercard","RuPay","Amex"].map(n => <option key={n} value={n} className="bg-dark-900">{n}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                    {pmForm.type === "upi" && (
                      <div>
                        <label className="block text-xs text-white/50 mb-1">UPI ID</label>
                        <input value={pmForm.upiId} onChange={e => setPmForm(f => ({ ...f, upiId: e.target.value }))} placeholder="yourname@upi" className="input-dark text-sm" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isDefault" checked={pmForm.isDefault} onChange={e => setPmForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-violet-500" />
                      <label htmlFor="isDefault" className="text-xs text-white/50">Set as default</label>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowPmForm(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
                      <button type="submit" disabled={addingPm} className="btn-primary flex-1 py-2 text-sm disabled:opacity-50">{addingPm ? "Saving..." : "Save Method"}</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              {(d.savedPaymentMethods || []).length > 0 ? (
                <div className="space-y-3">
                  {d.savedPaymentMethods.map((pm, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${pm.isDefault ? "border-violet-500/40 bg-violet-500/5" : "border-white/10 hover:border-white/20"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{pm.label || (pm.type === "upi" ? pm.upiId : `${pm.network} •••• ${pm.last4}`)}</p>
                          <p className="text-xs text-white/40 capitalize">{pm.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pm.isDefault && <span className="badge badge-purple text-xs">Default</span>}
                        <button onClick={() => handleDeletePm(pm._id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No saved payment methods</p>
                </div>
              )}
            </SectionCard>
            <SectionCard title="EMI Options" icon={Zap} iconColor="text-amber-400">
              <p className="text-sm text-white/50 mb-4">Split bookings above ₹3,000 into easy monthly instalments via Razorpay EMI.</p>
              <div className="grid grid-cols-3 gap-3">
                {[{ months: 3, rate: "0%", label: "No Cost EMI" },{ months: 6, rate: "1.5%", label: "Standard EMI" },{ months: 12, rate: "2%", label: "Extended EMI" }].map(plan => (
                  <div key={plan.months} className="glass rounded-xl p-4 text-center hover:border-white/20 transition-all">
                    <p className="text-xl font-black gradient-text">{plan.months}</p>
                    <p className="text-xs text-white/40">months</p>
                    <p className="text-xs text-emerald-400 mt-1">{plan.rate}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{plan.label}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            DOCUMENTS TAB
        ══════════════════════════════════════════════════════════ */}
        {tab === "documents" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <SectionCard title="Travel Documents Vault" icon={Shield} iconColor="text-violet-400"
              action={<button onClick={() => setShowDocForm(!showDocForm)} className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Document</button>}>
              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-5">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300/80 leading-relaxed">Documents are encrypted. Only document numbers are stored — no scans or images.</p>
              </div>
              <AnimatePresence>
                {showDocForm && (
                  <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} onSubmit={handleAddDoc}
                    className="overflow-hidden mb-5 pb-5 border-b border-white/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Document Type *</label>
                        <select value={docForm.docType} onChange={e => setDocForm(f => ({ ...f, docType: e.target.value }))} className="input-dark text-sm">
                          {["Passport","Aadhaar","PAN","Driving Licence","Voter ID","Other"].map(t => <option key={t} value={t} className="bg-dark-900">{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Document Number *</label>
                        <input required value={docForm.docNumber} onChange={e => setDocForm(f => ({ ...f, docNumber: e.target.value }))} placeholder="e.g. A1234567" className="input-dark text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Name on Document</label>
                        <input value={docForm.name} onChange={e => setDocForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="input-dark text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1">Expiry Date</label>
                        <input type="date" value={docForm.expiry} onChange={e => setDocForm(f => ({ ...f, expiry: e.target.value }))} className="input-dark text-sm [color-scheme:dark]" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShowDocForm(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
                      <button type="submit" disabled={addingDoc} className="btn-primary flex-1 py-2 text-sm disabled:opacity-50">{addingDoc ? "Saving..." : "Save Document"}</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
              {(d.travelDocuments || []).length > 0 ? (
                <div className="space-y-3">
                  {d.travelDocuments.map((doc, i) => {
                    const isExpired    = doc.expiry && new Date(doc.expiry) < new Date();
                    const expiringSoon = doc.expiry && !isExpired && (new Date(doc.expiry) - new Date()) < 90 * 24 * 60 * 60 * 1000;
                    return (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isExpired ? "border-red-500/30 bg-red-500/5" : expiringSoon ? "border-amber-500/30 bg-amber-500/5" : "border-white/10 hover:border-white/20"}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-violet-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white">{doc.docType}</p>
                              {isExpired    && <span className="badge badge-red text-[10px]">Expired</span>}
                              {expiringSoon && <span className="badge badge-yellow text-[10px]">Expiring Soon</span>}
                            </div>
                            <p className="text-xs text-white/40">•••• {doc.docNumber.slice(-4)}{doc.name && ` · ${doc.name}`}</p>
                            {doc.expiry && <p className="text-xs text-white/30">Expires: {new Date(doc.expiry).toLocaleDateString("en-IN")}</p>}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteDoc(doc._id)} className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No documents saved</p>
                </div>
              )}
            </SectionCard>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TRIPS TAB
        ══════════════════════════════════════════════════════════ */}
        {tab === "trips" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <SectionCard title={`Upcoming Trips (${d.upcomingCount || 0})`} icon={Calendar} iconColor="text-blue-400">
              {(d.upcomingBookings || []).length > 0 ? (
                <div className="space-y-4">
                  {d.upcomingBookings.map((b, i) => (
                    <div key={i} className="glass rounded-xl p-4 border border-blue-500/10 hover:border-blue-500/20 transition-all">
                      <div className="flex items-start gap-4">
                        {b.hotel?.thumbnail && (
                          <img src={b.hotel.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" onError={e => e.target.style.display = "none"} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-white">{b.hotel?.name}</p>
                              <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-violet-400" />{b.hotel?.location?.city}</p>
                            </div>
                            <div className={`text-center px-3 py-1.5 rounded-xl ${b.daysUntil <= 3 ? "bg-red-500/20 text-red-400" : b.daysUntil <= 7 ? "bg-amber-500/20 text-amber-400" : "bg-violet-500/20 text-violet-400"}`}>
                              <p className="text-xl font-black leading-none">{b.daysUntil}</p>
                              <p className="text-[10px]">days</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/40">
                            <span>{new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span>→</span>
                            <span>{new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span className="text-white/30">·</span>
                            <span>{b.nights} night{b.nights > 1 ? "s" : ""}</span>
                            <span className="text-white/30">·</span>
                            <span>{b.roomType}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm font-bold gradient-text">{fmt(b.finalAmount)}</span>
                            <button onClick={() => handleInvoice(b._id)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors glass px-3 py-1.5 rounded-lg">
                              <Download className="w-3.5 h-3.5" /> Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No upcoming trips</p>
                  <Link to="/hotels" className="btn-primary text-xs px-4 py-2 mt-3 inline-flex">Book a Stay</Link>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Recent Bookings" icon={Clock} iconColor="text-violet-400"
              action={<Link to="/my-bookings" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</Link>}>
              {(d.recentBookings || []).length > 0 ? (
                <div className="space-y-3">
                  {d.recentBookings.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                      {b.hotel?.thumbnail && (
                        <img src={b.hotel.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => e.target.style.display = "none"} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{b.hotel?.name}</p>
                        <p className="text-xs text-white/40">{new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {b.roomType}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`badge text-xs ${b.bookingStatus === "CONFIRMED" ? "badge-green" : b.bookingStatus === "CANCELLED" ? "badge-red" : b.bookingStatus === "COMPLETED" ? "badge-purple" : "badge-yellow"}`}>
                          {b.bookingStatus}
                        </span>
                        {b.bookingStatus === "CANCELLED" && b.paymentStatus === "SUCCESS" && b.refundStatus !== "PROCESSED" && (
                          <button onClick={() => handleRefund(b._id)} disabled={refunding === b._id}
                            className="text-xs px-2.5 py-1 bg-blue-500/15 text-blue-400 rounded-lg hover:bg-blue-500/25 transition-all disabled:opacity-50">
                            {refunding === b._id ? "..." : "Refund"}
                          </button>
                        )}
                        {b.refundStatus === "PROCESSED" && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Refunded</span>
                        )}
                        <button onClick={() => handleInvoice(b._id)} className="w-7 h-7 glass rounded-lg flex items-center justify-center text-white/30 hover:text-white transition-all">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-white/30 text-sm text-center py-6">No bookings yet</p>}
            </SectionCard>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════
            SPENDING TAB — fully real-time
        ══════════════════════════════════════════════════════════ */}
        {tab === "spending" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* Live spending KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Spent",     value: conv(d.totalSpent),     icon: IndianRupee, color: "from-violet-500 to-purple-600", live: true },
                { label: "This Month",      value: conv(d.thisMonthSpent), icon: BarChart3,   color: "from-blue-500 to-cyan-600",    live: true },
                { label: "Today",           value: conv(d.todaySpent),     icon: Zap,         color: "from-emerald-500 to-teal-600", live: true },
                { label: "Avg per Booking", value: conv(d.avgPerBooking),  icon: TrendingUp,  color: "from-amber-500 to-orange-500" },
              ].map((k, i) => (
                <motion.div key={k.label} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                  className="glass rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
                  <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${k.color} opacity-10 blur-xl`} />
                  {k.live && isConnected && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <k.icon className="w-5 h-5 text-white" />
                  </div>
                  <LiveNumber value={k.value} className="text-xl font-black text-white block" />
                  <p className="text-xs text-white/40 mt-0.5">{k.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Monthly spending chart */}
            <SectionCard title="Monthly Spending (Last 6 Months)" icon={BarChart3} iconColor="text-violet-400">
              {Object.keys(d.monthlySpending || {}).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(d.monthlySpending)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .slice(-6)
                    .map(([key, val], i, arr) => {
                      const max = Math.max(...arr.map(([, v]) => v), 1);
                      const pct = (val / max) * 100;
                      const [yr, mo] = key.split("-");
                      const label = `${MONTHS[parseInt(mo) - 1]} ${yr}`;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs text-white/40 w-16 flex-shrink-0">{label}</span>
                          <div className="flex-1 h-5 bg-dark-800 rounded-lg overflow-hidden relative">
                            <motion.div key={`${key}-${val}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.1 + i * 0.06, duration: 0.7 }}
                              className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-end pr-2">
                              {pct > 25 && <span className="text-[10px] text-white/80 font-medium">{conv(val)}</span>}
                            </motion.div>
                            {pct <= 25 && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/40">{conv(val)}</span>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : <p className="text-white/30 text-sm text-center py-8">No spending data yet</p>}
            </SectionCard>

            {/* Category breakdown */}
            <SectionCard title="Spending by Hotel Category" icon={Award} iconColor="text-amber-400">
              {Object.keys(d.categorySpend || {}).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(d.categorySpend)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, val], i) => {
                      const total = Object.values(d.categorySpend).reduce((s, v) => s + v, 0) || 1;
                      const pct   = Math.round((val / total) * 100);
                      const colors = { "Ultra-Luxury": "from-rose-500 to-pink-500", "Luxury": "from-amber-500 to-orange-500", "Premium": "from-violet-500 to-purple-500", "Standard": "from-blue-500 to-cyan-500", "Budget": "from-emerald-500 to-teal-500" };
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-white/60">{cat}</span>
                            <span className="text-white font-medium">{conv(val)} <span className="text-white/30">({pct}%)</span></span>
                          </div>
                          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                            <motion.div key={`${cat}-${val}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                              className={`h-full bg-gradient-to-r ${colors[cat] || "from-violet-500 to-blue-500"} rounded-full`} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : <p className="text-white/30 text-sm text-center py-8">No spending data yet</p>}
            </SectionCard>

            {/* Cities visited */}
            {(d.citiesVisited || []).length > 0 && (
              <SectionCard title="Cities Visited" icon={Globe} iconColor="text-emerald-400">
                <div className="flex flex-wrap gap-2">
                  {d.citiesVisited.map(city => (
                    <Link key={city} to={`/hotels?search=${city}`}
                      className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/20 transition-all">
                      <MapPin className="w-3.5 h-3.5 text-violet-400" />{city}
                    </Link>
                  ))}
                </div>
              </SectionCard>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
