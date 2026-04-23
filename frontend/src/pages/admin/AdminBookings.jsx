import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CreditCard, Search, Filter } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import AdminSidebar from './AdminSidebar';

const STATUS_COLORS = {
  CONFIRMED: 'badge-green', PENDING: 'badge-yellow',
  CANCELLED: 'badge-red', COMPLETED: 'badge-purple',
};
const PAYMENT_COLORS = {
  SUCCESS: 'text-emerald-400', PENDING: 'text-yellow-400',
  FAILED: 'text-red-400', REFUNDED: 'text-blue-400',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const res = await bookingAPI.getAll(params);
      setBookings(res.data.bookings);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page, statusFilter]);

  return (
    <div className="flex min-h-screen bg-dark-950">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white">Bookings</h1>
              <p className="text-white/40 text-sm mt-0.5">{total} total bookings</p>
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="glass text-white/70 text-sm px-4 py-2.5 rounded-xl focus:outline-none">
              <option value="" className="bg-dark-900">All Status</option>
              {['CONFIRMED','PENDING','CANCELLED','COMPLETED'].map(s => (
                <option key={s} value={s} className="bg-dark-900">{s}</option>
              ))}
            </select>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-white/40">
                    <th className="text-left p-4 font-medium">Booking</th>
                    <th className="text-left p-4 font-medium">Hotel</th>
                    <th className="text-left p-4 font-medium">Guest</th>
                    <th className="text-left p-4 font-medium">Dates</th>
                    <th className="text-right p-4 font-medium">Amount</th>
                    <th className="text-center p-4 font-medium">Status</th>
                    <th className="text-center p-4 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="p-4"><div className="skeleton h-4 rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : bookings.map((b, i) => (
                    <motion.tr key={b._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <p className="text-xs font-mono text-white/50">#{b._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-white/30 mt-0.5">{b.roomType}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-white line-clamp-1">{b.hotel?.name}</p>
                        <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5">
                          <MapPin className="w-3 h-3" />{b.hotel?.location?.city}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-white">{b.user?.name}</p>
                        <p className="text-xs text-white/40">{b.user?.email}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-white/60">
                          <Calendar className="w-3 h-3 text-violet-400" />
                          {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {' → '}
                          {new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                        <p className="text-xs text-white/30 mt-0.5">{b.nights} night{b.nights > 1 ? 's' : ''}</p>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-sm font-bold gradient-text">
                          ₹{b.finalAmount?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`badge ${STATUS_COLORS[b.bookingStatus] || 'badge-purple'} text-xs`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-medium ${PAYMENT_COLORS[b.paymentStatus] || 'text-white/50'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="px-4 py-2 glass rounded-xl text-sm text-white/70 hover:text-white disabled:opacity-30 transition-all">
                Previous
              </button>
              <span className="text-sm text-white/50">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                className="px-4 py-2 glass rounded-xl text-sm text-white/70 hover:text-white disabled:opacity-30 transition-all">
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;
