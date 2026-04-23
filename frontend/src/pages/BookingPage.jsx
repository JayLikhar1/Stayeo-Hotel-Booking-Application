import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import BookingModal from '../components/booking/BookingModal';
import { AnimatePresence } from 'framer-motion';

// This page auto-opens the booking modal for a hotel
const BookingPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    hotelAPI.getById(hotelId)
      .then(res => setHotel(res.data.hotel))
      .catch(() => navigate('/hotels'));
  }, [hotelId]);

  if (!hotel) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <AnimatePresence>
      <BookingModal
        hotel={hotel}
        isOpen={true}
        onClose={() => navigate(`/hotels/${hotelId}`)}
      />
    </AnimatePresence>
  );
};

export default BookingPage;
