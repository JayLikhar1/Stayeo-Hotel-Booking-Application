import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, MapPin, Search } from 'lucide-react';
import { hotelAPI } from '../../services/api';
import { useToastStore } from '../../store/toastStore';
import AdminSidebar from './AdminSidebar';
import Modal from '../../components/ui/Modal';

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error } = useToastStore();

  const fetchHotels = async () => {
    try {
      const res = await hotelAPI.getAll({ limit: 100, search });
      setHotels(res.data.hotels);
    } catch (err) {
      error('Failed to load hotels');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, [search]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      await hotelAPI.delete(deleteModal._id);
      success('Hotel deleted successfully');
      setDeleteModal(null);
      fetchHotels();
    } catch (err) {
      error('Failed to delete hotel');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-950">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white">Hotels</h1>
              <p className="text-white/40 text-sm mt-0.5">{hotels.length} total hotels</p>
            </div>
            <Link to="/admin/hotels/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
              <Plus className="w-4 h-4" /> Add Hotel
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotels..." className="input-dark pl-10 text-sm" />
          </div>

          {/* Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-white/40">
                    <th className="text-left p-4 font-medium">Hotel</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-right p-4 font-medium">Price</th>
                    <th className="text-right p-4 font-medium">Rating</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="p-4"><div className="skeleton h-4 rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : hotels.map((hotel, i) => (
                    <motion.tr key={hotel._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={hotel.thumbnail || hotel.images?.[0]}
                            alt={hotel.name}
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-white line-clamp-1">{hotel.name}</p>
                            <p className="text-xs text-white/40">{hotel.rooms?.length || 0} room types</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-white/60">
                          <MapPin className="w-3.5 h-3.5 text-violet-400" />
                          {hotel.location?.city}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="badge badge-purple text-xs">{hotel.category}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-sm font-semibold gradient-text">
                          ₹{hotel.price?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-white/70">{hotel.rating?.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/hotels/edit/${hotel._id}`}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => setDeleteModal(hotel)}
                            className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Hotel" size="sm">
        <div className="p-6">
          <p className="text-white/70 mb-2">Are you sure you want to delete</p>
          <p className="font-bold text-white mb-4">"{deleteModal?.name}"?</p>
          <p className="text-sm text-white/40 mb-6">This will deactivate the hotel and hide it from users.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModal(null)} className="flex-1 btn-secondary py-2.5 text-sm">Cancel</button>
            <button onClick={handleDelete} disabled={isDeleting}
              className="flex-1 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50 transition-all">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminHotels;
