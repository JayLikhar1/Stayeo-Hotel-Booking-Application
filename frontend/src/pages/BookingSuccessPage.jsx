import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, CreditCard, Download, ArrowRight } from 'lucide-react';
import { bookingAPI } from '../services/api';

const BookingSuccessPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await bookingAPI.getById(bookingId);
        setBooking(res.data.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-lg">

        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h1>
          <p className="text-white/50">Your stay has been successfully booked.</p>
        </div>

        {/* Booking Card */}
        {booking && (
          <div className="glass rounded-2xl overflow-hidden shadow-glow-sm">
            {/* Hotel image */}
            {booking.hotel?.thumbnail && (
              <div className="h-40 overflow-hidden">
                <img src={booking.hotel.thumbnail} alt={booking.hotel.name}
                  className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Hotel name */}
              <div>
                <h2 className="text-xl font-bold text-white">{booking.hotel?.name}</h2>
                <div className="flex items-center gap-1.5 text-sm text-white/50 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  {booking.hotel?.location?.city}, {booking.hotel?.location?.country}
                </div>
              </div>

              <div className="border-t border-white/10" />

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Booking ID', value: booking._id?.slice(-8).toUpperCase(), icon: CreditCard },
                  { label: 'Room Type', value: booking.roomType, icon: null },
                  { label: 'Check-in', value: new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: Calendar },
                  { label: 'Check-out', value: new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: Calendar },
                  { label: 'Duration', value: `${booking.nights} night${booking.nights > 1 ? 's' : ''}`, icon: null },
                  { label: 'Guests', value: `${booking.guests?.adults} adult${booking.guests?.adults > 1 ? 's' : ''}`, icon: null },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-white/40 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10" />

              {/* Amount */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">Total Paid</p>
                  <p className="text-2xl font-black gradient-text">
                    ₹{booking.finalAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm px-3 py-1.5">
                  ✓ Confirmed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link to="/my-bookings"
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
            View My Bookings <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/hotels"
            className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
            Explore More Hotels
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccessPage;
