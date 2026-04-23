import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CreditCard, X, Eye, Hotel } from 'lucide-react';
import { bookingAPI } from '../services/api';
import { useToastStore } from '../store/toastStore';
import Modal from '../components/ui/Modal';

const STATUS_COLORS = {
  CONFIRMED: 'badge-green',
  PENDING: 'badge-yellow',
  CANCELLED: 'badge-red',
  COMPLETED: 'badge-purple',
};

const PAYMENT_COLORS = {
  SUCCESS: 'text-emerald-400',
  PENDING: 'text-yellow-400',
  FAILED: 'text-red-400',
  REFUNDED: 'text-blue-400',
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { success, error } = useToastStore();

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getMyBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async () => {
    if (!cancelModal) return;
    setIsCancelling(true);
    try {
      await bookingAPI.cancel(cancelModal._id, { reason: 'Cancelled by user' });
      success('Booking cancelled successfully');
      setCancelModal(null);
      fetchBookings();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 section-container">
        <div className="skeleton h-8 w-48 rounded mb-8" />
        {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl mb-4" />)}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-white/40 mb-8">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>

          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <Hotel className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
              <p className="text-white/40 mb-6">Start exploring and book your first stay</p>
              <Link to="/hotels" className="btn-primary px-6 py-2.5 text-sm inline-flex">
                Explore Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, i) => (
                <motion.div key={booking._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel image */}
                    {booking.hotel?.thumbnail && (
                      <div className="md:w-48 h-40 md:h-auto flex-shrink-0 overflow-hidden">
                        <img src={booking.hotel.thumbnail} alt={booking.hotel.name}
                          className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-white text-lg">{booking.hotel?.name}</h3>
                          <div className="flex items-center gap-1.5 text-sm text-white/50 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-violet-400" />
                            {booking.hotel?.location?.city}
                          </div>
                        </div>
                        <span className={`badge ${STATUS_COLORS[booking.bookingStatus] || 'badge-purple'}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div>
                          <p className="text-xs text-white/40">Check-in</p>
                          <p className="text-sm font-medium text-white">
                            {new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Check-out</p>
                          <p className="text-sm font-medium text-white">
                            {new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Room</p>
                          <p className="text-sm font-medium text-white">{booking.roomType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40">Total</p>
                          <p className="text-sm font-bold gradient-text">₹{booking.finalAmount?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-white/30" />
                          <span className={PAYMENT_COLORS[booking.paymentStatus] || 'text-white/50'}>
                            Payment: {booking.paymentStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/hotels/${booking.hotel?._id}`}
                            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5 glass rounded-lg">
                            <Eye className="w-3.5 h-3.5" /> View Hotel
                          </Link>
                          {['CONFIRMED', 'PENDING'].includes(booking.bookingStatus) && (
                            <button onClick={() => setCancelModal(booking)}
                              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 bg-red-500/10 rounded-lg hover:bg-red-500/20">
                              <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Booking" size="sm">
        <div className="p-6">
          <p className="text-white/70 mb-2">Are you sure you want to cancel your booking at</p>
          <p className="font-bold text-white mb-4">{cancelModal?.hotel?.name}?</p>
          <p className="text-sm text-white/40 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setCancelModal(null)}
              className="flex-1 btn-secondary py-2.5 text-sm">Keep Booking</button>
            <button onClick={handleCancel} disabled={isCancelling}
              className="flex-1 btn-primary py-2.5 text-sm bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-50">
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
