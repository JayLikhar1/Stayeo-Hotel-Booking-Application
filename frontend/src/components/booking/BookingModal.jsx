import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, CreditCard, CheckCircle, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { bookingAPI, paymentAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';

const STEPS = ['Dates & Room', 'Guest Details', 'Review & Pay'];

const BookingModal = ({ hotel, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { success, error, info } = useToastStore();

  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    checkIn: today,
    checkOut: tomorrow,
    roomType: hotel?.rooms?.[0]?.type || 'Standard',
    adults: 2,
    children: 0,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
  });

  if (!isOpen) return null;

  const selectedRoom = hotel?.rooms?.find((r) => r.type === form.roomType) || hotel?.rooms?.[0];
  const pricePerNight = selectedRoom?.price || hotel?.price || 0;
  const nights = Math.max(
    1,
    Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24))
  );
  const subtotal = pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleNext = () => {
    if (step === 0) {
      if (!form.checkIn || !form.checkOut) return error('Please select check-in and check-out dates');
      if (new Date(form.checkOut) <= new Date(form.checkIn)) return error('Check-out must be after check-in');
    }
    if (step === 1) {
      if (!form.name || !form.email) return error('Please fill in guest details');
    }
    setStep((s) => s + 1);
  };

  const handlePay = async () => {
    if (!isAuthenticated) {
      info('Please sign in to book');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create booking
      const bookingRes = await bookingAPI.create({
        hotelId: hotel._id,
        roomType: form.roomType,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: { adults: form.adults, children: form.children },
        specialRequests: form.specialRequests,
        guestDetails: { name: form.name, email: form.email, phone: form.phone },
      });

      const booking = bookingRes.data.booking;

      // 2. Create Razorpay order
      const orderRes = await paymentAPI.createOrder(booking._id);
      const { order, key } = orderRes.data;

      // 3. Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'StayEo',
        description: `Booking at ${hotel.name}`,
        image: '/stayeo-logo.png',
        order_id: order.id,
        handler: async (response) => {
          try {
            // 4. Verify payment
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });

            if (verifyRes.data.success) {
              success('Payment successful! Booking confirmed.');
              onClose();
              navigate(`/booking/success/${booking._id}`);
            }
          } catch (err) {
            error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: { bookingId: booking._id },
        theme: { color: '#7c3aed' },
        modal: {
          ondismiss: () => {
            info('Payment cancelled. Your booking is saved as pending.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full sm:max-w-lg glass rounded-t-3xl sm:rounded-2xl shadow-card-hover overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-1">Book Your Stay</h2>
          <p className="text-sm text-white/50">{hotel?.name}</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  i === step ? 'text-violet-400' : i < step ? 'text-emerald-400' : 'text-white/30'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i < step ? 'bg-emerald-500' : i === step ? 'bg-violet-600' : 'bg-white/10'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Check-in</label>
                    <input type="date" value={form.checkIn} min={today}
                      onChange={(e) => handleChange('checkIn', e.target.value)}
                      className="input-dark text-sm [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Check-out</label>
                    <input type="date" value={form.checkOut} min={form.checkIn || tomorrow}
                      onChange={(e) => handleChange('checkOut', e.target.value)}
                      className="input-dark text-sm [color-scheme:dark]" />
                  </div>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Room Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {hotel?.rooms?.map((room) => (
                      <button key={room.type} type="button"
                        onClick={() => handleChange('roomType', room.type)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          form.roomType === room.type
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{room.type}</p>
                          <p className="text-xs text-white/40">Up to {room.capacity} guests</p>
                        </div>
                        <span className="text-sm font-bold gradient-text">₹{room.price?.toLocaleString('en-IN')}/night</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Adults</label>
                    <select value={form.adults} onChange={(e) => handleChange('adults', Number(e.target.value))}
                      className="input-dark text-sm">
                      {[1,2,3,4].map(n => <option key={n} value={n} className="bg-dark-900">{n} Adult{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Children</label>
                    <select value={form.children} onChange={(e) => handleChange('children', Number(e.target.value))}
                      className="input-dark text-sm">
                      {[0,1,2,3].map(n => <option key={n} value={n} className="bg-dark-900">{n} Child{n !== 1 ? 'ren' : ''}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@example.com" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 43210" className="input-dark text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Special Requests</label>
                  <textarea value={form.specialRequests} onChange={(e) => handleChange('specialRequests', e.target.value)}
                    placeholder="Any special requests or preferences..." rows={3}
                    className="input-dark text-sm resize-none" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {/* Summary */}
                <div className="bg-dark-800/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Booking Summary</h3>
                  {[
                    ['Hotel', hotel?.name],
                    ['Room', form.roomType],
                    ['Check-in', new Date(form.checkIn).toDateString()],
                    ['Check-out', new Date(form.checkOut).toDateString()],
                    ['Duration', `${nights} night${nights > 1 ? 's' : ''}`],
                    ['Guests', `${form.adults} adult${form.adults > 1 ? 's' : ''}${form.children > 0 ? `, ${form.children} child${form.children > 1 ? 'ren' : ''}` : ''}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-white/50">{label}</span>
                      <span className="text-white font-medium text-right max-w-[60%] truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="bg-dark-800/50 rounded-xl p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-white mb-3">Price Breakdown</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">₹{pricePerNight.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">GST (18%)</span>
                    <span className="text-white">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold gradient-text text-lg">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Test card info */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                  <p className="text-xs text-blue-300 font-medium mb-1">🧪 Test Mode</p>
                  <p className="text-xs text-blue-300/70">Use card: 4111 1111 1111 1111 | Exp: any future date | CVV: any 3 digits</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button onClick={onClose} className="text-sm text-white/50 hover:text-white transition-colors">
              Cancel
            </button>
          )}

          {step < 2 ? (
            <button onClick={handleNext}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handlePay} disabled={isLoading}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Pay ₹{total.toLocaleString('en-IN')}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
