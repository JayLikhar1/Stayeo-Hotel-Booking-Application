import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { hotelAPI } from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import AdminSidebar from './AdminSidebar';

const CATEGORIES = ['Budget', 'Standard', 'Premium', 'Luxury', 'Ultra-Luxury'];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Studio'];
const AMENITIES_LIST = ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Airport Transfer', 'Room Service', 'Business Center', 'Concierge', 'Valet Parking'];

const defaultRoom = { type: 'Standard', price: 5000, capacity: 2, amenities: [], count: 1 };

const AdminHotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToastStore();
  const isEdit = !!id;

  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: 'Standard', isFeatured: false,
    location: { city: '', state: '', country: 'India', address: '' },
    images: [''],
    thumbnail: '',
    amenities: [],
    rooms: [{ ...defaultRoom }],
    checkInTime: '14:00', checkOutTime: '11:00',
    policies: { cancellation: 'Free cancellation up to 24 hours before check-in', pets: false, smoking: false },
  });

  useEffect(() => {
    if (isEdit) {
      hotelAPI.getById(id).then(res => {
        const h = res.data.hotel;
        setForm({
          name: h.name, description: h.description, price: h.price,
          category: h.category, isFeatured: h.isFeatured,
          location: h.location,
          images: h.images?.length ? h.images : [''],
          thumbnail: h.thumbnail || '',
          amenities: h.amenities || [],
          rooms: h.rooms?.length ? h.rooms : [{ ...defaultRoom }],
          checkInTime: h.checkInTime || '14:00',
          checkOutTime: h.checkOutTime || '11:00',
          policies: h.policies || form.policies,
        });
      }).catch(() => navigate('/admin/hotels'));
    }
  }, [id]);

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const setLoc = (key, value) => setForm(f => ({ ...f, location: { ...f.location, [key]: value } }));

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  const updateRoom = (i, key, value) => {
    const rooms = [...form.rooms];
    rooms[i] = { ...rooms[i], [key]: value };
    set('rooms', rooms);
  };

  const addRoom = () => set('rooms', [...form.rooms, { ...defaultRoom }]);
  const removeRoom = (i) => set('rooms', form.rooms.filter((_, idx) => idx !== i));

  const updateImage = (i, value) => {
    const imgs = [...form.images];
    imgs[i] = value;
    set('images', imgs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) return error('Please fill in required fields');

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images.filter(Boolean),
        thumbnail: form.thumbnail || form.images.find(Boolean) || '',
      };

      if (isEdit) {
        await hotelAPI.update(id, payload);
        success('Hotel updated successfully!');
      } else {
        await hotelAPI.create(payload);
        success('Hotel created successfully!');
      }
      navigate('/admin/hotels');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save hotel');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-950">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/admin/hotels')}
              className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">{isEdit ? 'Edit Hotel' : 'Add New Hotel'}</h1>
              <p className="text-white/40 text-sm">Fill in the hotel details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white">Basic Information</h3>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Hotel Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. The Grand Palace Hotel" className="input-dark" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={4} placeholder="Describe the hotel..." className="input-dark resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Base Price (₹/night) *</label>
                  <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                    placeholder="5000" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="input-dark">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.isFeatured}
                  onChange={e => set('isFeatured', e.target.checked)}
                  className="w-4 h-4 accent-violet-500" />
                <label htmlFor="featured" className="text-sm text-white/60">Mark as Featured</label>
              </div>
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">City *</label>
                  <input value={form.location.city} onChange={e => setLoc('city', e.target.value)}
                    placeholder="Mumbai" className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">State</label>
                  <input value={form.location.state} onChange={e => setLoc('state', e.target.value)}
                    placeholder="Maharashtra" className="input-dark" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Address</label>
                <input value={form.location.address} onChange={e => setLoc('address', e.target.value)}
                  placeholder="123 Hotel Street" className="input-dark" />
              </div>
            </div>

            {/* Images */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white">Images</h3>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Thumbnail URL</label>
                <input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)}
                  placeholder="https://..." className="input-dark" />
              </div>
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input value={img} onChange={e => updateImage(i, e.target.value)}
                    placeholder={`Image URL ${i + 1}`} className="input-dark flex-1" />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                      className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => set('images', [...form.images, ''])}
                className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                <Plus className="w-4 h-4" /> Add Image URL
              </button>
            </div>

            {/* Amenities */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                      form.amenities.includes(a)
                        ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                        : 'border-white/10 text-white/50 hover:border-white/20'
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Room Types</h3>
                <button type="button" onClick={addRoom}
                  className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                  <Plus className="w-4 h-4" /> Add Room
                </button>
              </div>
              {form.rooms.map((room, i) => (
                <div key={i} className="bg-dark-800/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Room {i + 1}</span>
                    {form.rooms.length > 1 && (
                      <button type="button" onClick={() => removeRoom(i)}
                        className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Type</label>
                      <select value={room.type} onChange={e => updateRoom(i, 'type', e.target.value)}
                        className="input-dark text-sm py-2">
                        {ROOM_TYPES.map(t => <option key={t} value={t} className="bg-dark-900">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Price (₹/night)</label>
                      <input type="number" value={room.price}
                        onChange={e => updateRoom(i, 'price', Number(e.target.value))}
                        className="input-dark text-sm py-2" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Capacity</label>
                      <input type="number" value={room.capacity} min={1}
                        onChange={e => updateRoom(i, 'capacity', Number(e.target.value))}
                        className="input-dark text-sm py-2" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">Count</label>
                      <input type="number" value={room.count} min={1}
                        onChange={e => updateRoom(i, 'count', Number(e.target.value))}
                        className="input-dark text-sm py-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pb-8">
              <button type="button" onClick={() => navigate('/admin/hotels')}
                className="flex-1 btn-secondary py-3">Cancel</button>
              <button type="submit" disabled={isSaving}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : isEdit ? 'Update Hotel' : 'Create Hotel'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminHotelForm;
