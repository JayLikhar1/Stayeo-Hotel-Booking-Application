import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel, Users, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  BarChart3, Calendar, Star, Plus, RefreshCw, Target, Activity,
  MapPin, Award, Percent, Clock, ShoppingBag, Zap, DollarSign,
  PieChart, TrendingDown, CheckCircle, XCircle, AlertCircle, Wifi, WifiOff
} from "lucide-react";
import { bookingAPI, hotelAPI, authAPI } from "../../services/api";
import { useRealtimeAnalytics } from "../../hooks/useRealtimeAnalytics";
import AdminSidebar from "./AdminSidebar";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Exact Indian rupee format — ₹1,23,45,678
const fmt = (n) => {
  if (!n && n !== 0) return "₹0";
  return "₹" + Number(n).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};

const fmtNum = (n) => {
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return String(n);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const KPICard = ({ title, value, sub, icon: Icon, color, growth, growthLabel, delay = 0, live = false }) => {
  const positive = growth >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
      {/* Glow bg */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
      {/* Live pulse dot */}
      {live && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      )}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${positive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(growth)}%
            </div>
          )}
        </div>
        {/* Animate value changes */}
        <motion.p
          key={value}
          initial={{ opacity: 0.4, y: -6 }}
          animate={{ opacity: 1,   y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-2xl font-black text-white mb-0.5"
        >
          {value}
        </motion.p>
        <p className="text-sm text-white/40">{title}</p>
        {sub && <p className="text-xs text-white/25 mt-1">{sub}</p>}
        {growthLabel && <p className="text-xs text-white/30 mt-1">{growthLabel}</p>}
      </div>
    </motion.div>
  );
};

// Horizontal bar chart (pure CSS)
const BarChart = ({ data, valueKey, labelKey, colorClass = "from-violet-500 to-blue-500", formatValue }) => {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = ((item[valueKey] || 0) / max) * 100;
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-white/40 w-20 truncate flex-shrink-0">{item[labelKey]}</span>
            <div className="flex-1 h-2.5 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
              />
            </div>
            <span className="text-xs text-white/60 w-28 text-right flex-shrink-0">
              {formatValue ? formatValue(item[valueKey]) : item[valueKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Vertical bar chart (sparkline style)
const SparkBars = ({ data, valueKey, labelKey, color = "bg-violet-500" }) => {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((item, i) => {
        const pct = ((item[valueKey] || 0) / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
            <div className="w-full flex items-end" style={{ height: "64px" }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ delay: 0.2 + i * 0.04, duration: 0.6, ease: "easeOut" }}
                className={`w-full ${color} rounded-t-sm opacity-70 group-hover/bar:opacity-100 transition-opacity`}
                title={`${item[labelKey]}: ${item[valueKey]}`}
              />
            </div>
            <span className="text-[9px] text-white/20 truncate w-full text-center">{item[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
};

// Donut chart (CSS conic-gradient)
const DonutChart = ({ segments }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let cumulative = 0;
  const gradient = segments.map(seg => {
    const pct = (seg.value / total) * 100;
    const from = cumulative;
    cumulative += pct;
    return `${seg.color} ${from}% ${cumulative}%`;
  }).join(", ");

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <div
          className="w-28 h-28 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute inset-3 rounded-full bg-dark-900 flex items-center justify-center">
          <span className="text-xs font-bold text-white/60">{total}</span>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-xs text-white/60">{seg.label}</span>
            </div>
            <span className="text-xs font-semibold text-white">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mini metric row
const MetricRow = ({ label, value, sub, icon: Icon, iconColor }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-2.5">
      {Icon && <Icon className={`w-4 h-4 ${iconColor || "text-violet-400"}`} />}
      <span className="text-sm text-white/60">{label}</span>
    </div>
    <div className="text-right">
      <span className="text-sm font-bold text-white">{value}</span>
      {sub && <p className="text-xs text-white/30">{sub}</p>}
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [analytics, setAnalytics]     = useState(null);
  const [hotelStats, setHotelStats]   = useState(null);
  const [userCount, setUserCount]     = useState(0);
  const [isLoading, setIsLoading]     = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab]     = useState("overview");

  // ── Get JWT token for SSE auth ─────────────────────────────────────
  const token = localStorage.getItem("stayeo_token");

  // ── Real-time SSE hook ─────────────────────────────────────────────
  const { liveStats, newBooking, isConnected, lastUpdated } = useRealtimeAnalytics(token);

  // ── Merge live SSE stats into analytics state ──────────────────────
  useEffect(() => {
    if (!liveStats) return;
    setAnalytics((prev) => {
      if (!prev) return prev; // wait for initial full load
      return {
        ...prev,
        totalRevenue:      liveStats.totalRevenue,
        totalBookings:     liveStats.allBookings,
        thisMonthRevenue:  liveStats.thisMonthRevenue,
        thisMonthBookings: liveStats.thisMonthBookings,
        confirmedBookings: liveStats.confirmedBookings,
        cancelledBookings: liveStats.cancelledBookings,
        pendingBookings:   liveStats.pendingBookings,
        todayRevenue:      liveStats.todayRevenue,
        todayBookings:     liveStats.todayBookings,
      };
    });
    setLastRefresh(new Date(liveStats.timestamp));
  }, [liveStats]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, hotelRes, usersRes] = await Promise.all([
        bookingAPI.getAnalytics(),
        hotelAPI.getStats(),
        authAPI.getAllUsers(),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setHotelStats(hotelRes.data);
      setUserCount(usersRes.data.count);
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const a = analytics || {};

  // ── Derived data ────────────────────────────────────────────────────
  const statusSegments = [
    { label: "Confirmed", value: a.confirmedBookings || 0, color: "#10b981" },
    { label: "Completed", value: a.completedBookings || 0, color: "#3b82f6" },
    { label: "Cancelled", value: a.cancelledBookings || 0, color: "#ef4444" },
    { label: "Pending",   value: a.pendingBookings   || 0, color: "#f59e0b" },
  ];

  const categoryColors = {
    "Ultra-Luxury": "from-rose-500 to-pink-600",
    "Luxury":       "from-amber-500 to-orange-500",
    "Premium":      "from-violet-500 to-purple-600",
    "Standard":     "from-blue-500 to-cyan-500",
    "Budget":       "from-emerald-500 to-teal-500",
  };

  const dayLabels = (a.bookingsByDayOfWeek || []).map(d => ({
    ...d,
    label: DAYS[(d._id - 1 + 7) % 7],
    bookings: d.bookings,
  }));

  const monthlyData = (a.monthlyRevenue || []).map(m => ({
    label: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    bookings: m.bookings,
  }));

  const dailyData = (a.dailyBookings || []).slice(-14).map(d => ({
    label: d._id.slice(5),
    bookings: d.bookings,
    revenue: d.revenue,
  }));

  const TABS = ["overview", "revenue", "hotels", "bookings"];

  return (
    <div className="flex min-h-screen bg-dark-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">

          {/* ── New Booking Live Toast ───────────────────────────────── */}
          <AnimatePresence>
            {newBooking && (
              <motion.div
                initial={{ opacity: 0, y: -60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0,   scale: 1 }}
                exit={{   opacity: 0, y: -60,  scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="fixed top-5 right-5 z-50 flex items-start gap-3 glass border border-emerald-500/30 bg-emerald-500/10 rounded-2xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    New Booking!
                  </p>
                  <p className="text-xs text-white/70 mt-0.5 truncate">{newBooking.hotelName}</p>
                  <p className="text-xs text-white/40">{newBooking.city} · {newBooking.roomType}</p>
                  <p className="text-sm font-black gradient-text mt-1">{fmt(newBooking.amount)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Header ──────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-white">Analytics Dashboard</h1>
              <div className="flex items-center gap-3 mt-1">
                {/* Live connection indicator */}
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                  isConnected
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/15 text-red-400 border border-red-500/20"
                }`}>
                  {isConnected
                    ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</>
                    : <><WifiOff className="w-3 h-3" /> Offline</>
                  }
                </div>
                <p className="text-white/30 text-xs">
                  Updated {lastUpdated
                    ? lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                    : lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Today's live revenue pill */}
              {liveStats && (
                <motion.div
                  key={liveStats.todayRevenue}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="glass px-4 py-2 rounded-xl border border-violet-500/20 bg-violet-500/5"
                >
                  <p className="text-[10px] text-white/30 leading-none mb-0.5">Today's Revenue</p>
                  <p className="text-sm font-black gradient-text">{fmt(liveStats.todayRevenue || 0)}</p>
                </motion.div>
              )}
              <button onClick={fetchData} disabled={isLoading}
                className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40">
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <Link to="/admin/hotels/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
                <Plus className="w-4 h-4" /> Add Hotel
              </Link>
            </div>
          </motion.div>

          {/* ── Tab Nav ─────────────────────────────────────────────── */}
          <div className="flex gap-1 glass rounded-xl p-1 mb-8 w-fit">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-violet-600 text-white shadow-glow-sm"
                    : "text-white/40 hover:text-white/70"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              {/* ════════════════════════════════════════════════════════
                  OVERVIEW TAB
              ════════════════════════════════════════════════════════ */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                  {/* KPI Row 1 */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Revenue" value={fmt(a.totalRevenue || 0)}
                      sub={`This month: ${fmt(a.thisMonthRevenue || 0)}`}
                      icon={CreditCard} color="from-violet-500 to-purple-600"
                      growth={a.revenueGrowth} growthLabel="vs last month" delay={0} live={isConnected} />
                    <KPICard title="Total Bookings" value={fmtNum(a.totalBookings || 0)}
                      sub={`This month: ${a.thisMonthBookings || 0}`}
                      icon={Calendar} color="from-blue-500 to-cyan-600"
                      growth={a.bookingGrowth} growthLabel="vs last 30 days" delay={0.05} live={isConnected} />
                    <KPICard title="Avg Order Value" value={fmt(a.avgOrderValue || 0)}
                      sub={`Avg stay: ${a.avgNights || 0} nights`}
                      icon={DollarSign} color="from-emerald-500 to-teal-600"
                      delay={0.1} />
                    <KPICard title="Cancellation Rate" value={`${a.cancellationRate || 0}%`}
                      sub={`${a.cancelledBookings || 0} cancelled`}
                      icon={Percent} color="from-rose-500 to-red-600"
                      delay={0.15} />
                  </div>

                  {/* KPI Row 2 */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard title="Total Hotels" value={hotelStats?.totalHotels || 0}
                      icon={Hotel} color="from-amber-500 to-orange-500" delay={0.2} />
                    <KPICard title="Total Users" value={fmtNum(userCount)}
                      icon={Users} color="from-pink-500 to-rose-500" delay={0.25} />
                    <KPICard title="Confirmed" value={a.confirmedBookings || 0}
                      icon={CheckCircle} color="from-emerald-500 to-green-600" delay={0.3} live={isConnected} />
                    <KPICard title="Pending" value={a.pendingBookings || 0}
                      icon={AlertCircle} color="from-yellow-500 to-amber-500" delay={0.35} live={isConnected} />
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Booking Status Donut */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <PieChart className="w-4 h-4 text-violet-400" />
                        <h3 className="font-bold text-white text-sm">Booking Status</h3>
                      </div>
                      <DonutChart segments={statusSegments} />
                    </motion.div>

                    {/* Daily bookings sparkline */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-400" />
                          <h3 className="font-bold text-white text-sm">Daily Bookings (14d)</h3>
                        </div>
                        <span className="text-xs text-white/30">{a.last30Bookings || 0} last 30d</span>
                      </div>
                      {dailyData.length > 0 ? (
                        <SparkBars data={dailyData} valueKey="bookings" labelKey="label" color="bg-blue-500" />
                      ) : (
                        <p className="text-white/30 text-xs text-center py-8">No data yet</p>
                      )}
                    </motion.div>

                    {/* Day of week heatmap */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <h3 className="font-bold text-white text-sm">Bookings by Day</h3>
                      </div>
                      {dayLabels.length > 0 ? (
                        <SparkBars data={dayLabels} valueKey="bookings" labelKey="label" color="bg-emerald-500" />
                      ) : (
                        <p className="text-white/30 text-xs text-center py-8">No data yet</p>
                      )}
                    </motion.div>
                  </div>

                  {/* Top Cities + Room Types */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <MapPin className="w-4 h-4 text-violet-400" />
                        <h3 className="font-bold text-white text-sm">Top Cities by Revenue</h3>
                      </div>
                      {(a.topCities || []).length > 0 ? (
                        <BarChart
                          data={a.topCities.slice(0, 8)}
                          valueKey="revenue" labelKey="_id"
                          colorClass="from-violet-500 to-blue-500"
                          formatValue={fmt}
                        />
                      ) : <p className="text-white/30 text-xs text-center py-8">No data yet</p>}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white text-sm">Room Type Popularity</h3>
                      </div>
                      {(a.roomTypeStats || []).length > 0 ? (
                        <BarChart
                          data={a.roomTypeStats}
                          valueKey="bookings" labelKey="_id"
                          colorClass="from-amber-500 to-orange-500"
                          formatValue={(v) => `${v} bkgs`}
                        />
                      ) : <p className="text-white/30 text-xs text-center py-8">No data yet</p>}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ════════════════════════════════════════════════════════
                  REVENUE TAB
              ════════════════════════════════════════════════════════ */}
              {activeTab === "revenue" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                  {/* Revenue KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "Total Revenue",   value: fmt(a.totalRevenue || 0),     icon: CreditCard, color: "from-violet-500 to-purple-600", live: true },
                      { title: "This Month",      value: fmt(a.thisMonthRevenue || 0), icon: TrendingUp, color: "from-emerald-500 to-teal-600",  growth: a.revenueGrowth, live: true },
                      { title: "Last Month",      value: fmt(a.lastMonthRevenue || 0), icon: Calendar,   color: "from-blue-500 to-cyan-600" },
                      { title: "Avg Order Value", value: fmt(a.avgOrderValue || 0),    icon: Target,     color: "from-amber-500 to-orange-500" },
                    ].map((k, i) => <KPICard key={k.title} {...k} delay={i * 0.05} />)}
                  </div>

                  {/* Monthly Revenue Bar Chart */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-violet-400" />
                        <h3 className="font-bold text-white">Monthly Revenue — Last 12 Months</h3>
                      </div>
                      <span className="text-xs text-white/30">Total: {fmt(a.totalRevenue || 0)}</span>
                    </div>
                    {monthlyData.length > 0 ? (
                      <div className="space-y-3">
                        {monthlyData.map((m, i) => {
                          const max = Math.max(...monthlyData.map(x => x.revenue), 1);
                          const pct = (m.revenue / max) * 100;
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-white/40 w-8 flex-shrink-0">{m.label}</span>
                              <div className="flex-1 h-5 bg-dark-800 rounded-lg overflow-hidden relative">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ delay: 0.4 + i * 0.05, duration: 0.7, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-end pr-2 min-w-0"
                                >
                                  {pct > 30 && <span className="text-[10px] text-white/80 font-medium whitespace-nowrap">{fmt(m.revenue)}</span>}
                                </motion.div>
                                {pct <= 30 && (
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/40 whitespace-nowrap">{fmt(m.revenue)}</span>
                                )}
                              </div>
                              <span className="text-xs text-white/40 w-16 text-right flex-shrink-0">{m.bookings} bkgs</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : <p className="text-white/30 text-sm text-center py-12">No revenue data yet. Make some bookings!</p>}
                  </motion.div>

                  {/* Category Revenue + Payment Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white text-sm">Revenue by Hotel Category</h3>
                      </div>
                      {(a.categoryRevenue || []).length > 0 ? (
                        <div className="space-y-3">
                          {a.categoryRevenue.map((cat, i) => {
                            const total = a.categoryRevenue.reduce((s, c) => s + c.revenue, 0) || 1;
                            const pct = Math.round((cat.revenue / total) * 100);
                            const colors = { "Ultra-Luxury": "from-rose-500 to-pink-500", "Luxury": "from-amber-500 to-orange-500", "Premium": "from-violet-500 to-purple-500", "Standard": "from-blue-500 to-cyan-500", "Budget": "from-emerald-500 to-teal-500" };
                            return (
                              <div key={i}>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-white/60">{cat._id}</span>
                                  <span className="text-white font-medium">{fmt(cat.revenue)} <span className="text-white/30">({pct}%)</span></span>
                                </div>
                                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                    transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                                    className={`h-full bg-gradient-to-r ${colors[cat._id] || "from-violet-500 to-blue-500"} rounded-full`} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : <p className="text-white/30 text-xs text-center py-8">No data yet</p>}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-white text-sm">Payment Status Breakdown</h3>
                      </div>
                      {(a.paymentBreakdown || []).length > 0 ? (
                        <div className="space-y-1">
                          {a.paymentBreakdown.map((p, i) => {
                            const icons = { SUCCESS: CheckCircle, FAILED: XCircle, PENDING: AlertCircle, REFUNDED: RefreshCw };
                            const colors = { SUCCESS: "text-emerald-400", FAILED: "text-red-400", PENDING: "text-yellow-400", REFUNDED: "text-blue-400" };
                            const Icon = icons[p._id] || AlertCircle;
                            return (
                              <MetricRow key={i} label={p._id} value={`${p.count} bookings`}
                                sub={fmt(p.revenue)} icon={Icon} iconColor={colors[p._id]} />
                            );
                          })}
                        </div>
                      ) : <p className="text-white/30 text-xs text-center py-8">No data yet</p>}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ════════════════════════════════════════════════════════
                  HOTELS TAB
              ════════════════════════════════════════════════════════ */}
              {activeTab === "hotels" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                  {/* Hotel category stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {(hotelStats?.categoryStats || []).map((cat, i) => {
                      const gradients = { "Ultra-Luxury": "from-rose-500 to-pink-600", "Luxury": "from-amber-500 to-orange-500", "Premium": "from-violet-500 to-purple-600", "Standard": "from-blue-500 to-cyan-500", "Budget": "from-emerald-500 to-teal-500" };
                      return (
                        <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="glass rounded-2xl p-4 text-center hover:border-white/20 transition-all group">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[cat._id] || "from-violet-500 to-blue-500"} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                            <Hotel className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-xl font-black text-white">{cat.count}</p>
                          <p className="text-xs text-white/40 mt-0.5">{cat._id}</p>
                          <p className="text-xs text-white/25 mt-1">avg {fmt(Math.round(cat.avgPrice))}/night</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Top Hotels Table */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-violet-400" />
                        <h3 className="font-bold text-white">Top Hotels by Revenue</h3>
                      </div>
                      <Link to="/admin/hotels" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                        Manage all <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-white/30 border-b border-white/5">
                            <th className="text-left px-6 py-3 font-medium">#</th>
                            <th className="text-left px-6 py-3 font-medium">Hotel</th>
                            <th className="text-left px-6 py-3 font-medium">Category</th>
                            <th className="text-right px-6 py-3 font-medium">Bookings</th>
                            <th className="text-right px-6 py-3 font-medium">Revenue</th>
                            <th className="text-right px-6 py-3 font-medium">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(a.topHotels || []).length > 0 ? a.topHotels.map((item, i) => (
                            <tr key={i} className="hover:bg-white/2 transition-colors">
                              <td className="px-6 py-4">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-yellow-500 text-dark-950" : i === 1 ? "bg-gray-400 text-dark-950" : i === 2 ? "bg-amber-700 text-white" : "bg-white/10 text-white/40"}`}>
                                  {i + 1}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {item.hotel?.thumbnail && (
                                    <img src={item.hotel.thumbnail} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" onError={e => e.target.style.display="none"} />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-white">{item.hotel?.name}</p>
                                    <p className="text-xs text-white/40 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />{item.hotel?.location?.city}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="badge badge-purple text-xs">{item.hotel?.category}</span>
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-white/70">{item.bookings}</td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-sm font-bold gradient-text">{fmt(item.revenue)}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="flex items-center justify-end gap-1 text-sm text-yellow-400">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                                  {item.hotel?.rating?.toFixed(1) || "—"}
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-white/30 text-sm">No booking data yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>

                  {/* Top Cities */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <h3 className="font-bold text-white text-sm">Top 10 Cities by Revenue</h3>
                    </div>
                    {(a.topCities || []).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {a.topCities.map((city, i) => {
                          const max = a.topCities[0]?.revenue || 1;
                          const pct = (city.revenue / max) * 100;
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-white/30 w-4 flex-shrink-0">{i+1}</span>
                              <span className="text-xs text-white/60 w-24 truncate flex-shrink-0">{city._id}</span>
                              <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                  transition={{ delay: 0.6 + i * 0.04, duration: 0.6 }}
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                              </div>
                              <span className="text-xs text-white/50 w-28 text-right flex-shrink-0">{fmt(city.revenue)}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : <p className="text-white/30 text-xs text-center py-8">No data yet</p>}
                  </motion.div>
                </motion.div>
              )}

              {/* ════════════════════════════════════════════════════════
                  BOOKINGS TAB
              ════════════════════════════════════════════════════════ */}
              {activeTab === "bookings" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                  {/* Booking KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "Total Bookings",   value: a.totalBookings || 0,     icon: Calendar,     color: "from-violet-500 to-purple-600" },
                      { title: "Confirmed",        value: a.confirmedBookings || 0, icon: CheckCircle,  color: "from-emerald-500 to-teal-600" },
                      { title: "Cancelled",        value: a.cancelledBookings || 0, icon: XCircle,      color: "from-red-500 to-rose-600" },
                      { title: "Avg Stay (nights)",value: a.avgNights || 0,         icon: Clock,        color: "from-blue-500 to-cyan-600" },
                    ].map((k, i) => <KPICard key={k.title} {...k} delay={i * 0.05} />)}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Status donut */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <PieChart className="w-4 h-4 text-violet-400" />
                        <h3 className="font-bold text-white text-sm">Status Distribution</h3>
                      </div>
                      <DonutChart segments={statusSegments} />
                      <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                        {statusSegments.map((s, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-xs text-white/50">{s.label}</span>
                            <span className="text-xs font-bold text-white">
                              {a.totalBookings > 0 ? Math.round((s.value / a.totalBookings) * 100) : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Room type stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white text-sm">Room Type Performance</h3>
                      </div>
                      {(a.roomTypeStats || []).length > 0 ? (
                        <div className="space-y-1">
                          {a.roomTypeStats.map((r, i) => (
                            <MetricRow key={i}
                              label={r._id}
                              value={`${r.bookings} bookings`}
                              sub={`${fmt(r.revenue)} · avg ${Math.round(r.avgNights || 0)}n`}
                            />
                          ))}
                        </div>
                      ) : <p className="text-white/30 text-xs text-center py-8">No data yet</p>}
                    </motion.div>
                  </div>

                  {/* Daily bookings full chart */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-white text-sm">Daily Booking Activity (Last 30 Days)</h3>
                      </div>
                      <span className="text-xs text-white/30">{a.last30Bookings || 0} total</span>
                    </div>
                    {dailyData.length > 0 ? (
                      <div className="space-y-2">
                        {dailyData.map((d, i) => {
                          const max = Math.max(...dailyData.map(x => x.bookings), 1);
                          const pct = (d.bookings / max) * 100;
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-xs text-white/30 w-12 flex-shrink-0">{d.label}</span>
                              <div className="flex-1 h-3 bg-dark-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                  transition={{ delay: 0.5 + i * 0.03, duration: 0.5 }}
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                              </div>
                              <span className="text-xs text-white/50 w-8 text-right flex-shrink-0">{d.bookings}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : <p className="text-white/30 text-sm text-center py-12">No booking activity yet</p>}
                  </motion.div>

                  {/* Quick links */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "View All Bookings", href: "/admin/bookings", icon: Calendar, color: "from-violet-600 to-blue-600" },
                      { label: "Manage Hotels",     href: "/admin/hotels",   icon: Hotel,    color: "from-emerald-600 to-teal-600" },
                      { label: "Add New Hotel",     href: "/admin/hotels/new", icon: Plus,   color: "from-amber-600 to-orange-600" },
                    ].map((link, i) => (
                      <Link key={i} to={link.href}
                        className="glass rounded-xl p-4 flex items-center gap-3 hover:border-white/20 transition-all group">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <link.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{link.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
                      </Link>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
