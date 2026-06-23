import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeCard from '../components/ProgrammeCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { 
  getOwnProgrammes, 
  createProgramme, 
  updateProgramme, 
  updateProgrammeStatus, 
  getInterestsForProgramme,
  closeDeal
} from '../services/api';

const CampusDashboard = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [isCloseDealOpen, setIsCloseDealOpen] = useState(false);

  // Selected entities
  const [selectedProg, setSelectedProg] = useState(null);
  const [selectedEoi, setSelectedEoi] = useState(null);
  const [interests, setInterests] = useState([]);
  const [interestsLoading, setInterestsLoading] = useState(false);

  // Form states
  const initialFormState = {
    title: '',
    type: 'WORKSHOP',
    domain: '',
    subDomain: '',
    location: '',
    scale: 'OWN_INSTITUTE',
    startDate: '',
    endDate: '',
    participantsCount: 0,
    description: '',
    feeBased: false
  };
  const [formData, setFormData] = useState(initialFormState);

  // Deal closure form state
  const [dealData, setDealData] = useState({
    campusDeliverable: '',
    corporateDeliverable: ''
  });

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const response = await getOwnProgrammes();
      setProgrammes(response.data);
    } catch (err) {
      setToast({ message: 'Failed to load programmes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        participantsCount: parseInt(formData.participantsCount, 10) || 0
      };
      await createProgramme(payload);
      setToast({ message: 'Programme added successfully!', type: 'success' });
      setIsAddOpen(false);
      setFormData(initialFormState);
      fetchProgrammes();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to create programme.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (prog) => {
    setSelectedProg(prog);
    
    // Format dates for input type="datetime-local" (YYYY-MM-DDTHH:MM)
    const formatForInput = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const pad = (num) => String(num).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setFormData({
      title: prog.title || '',
      type: prog.type || 'WORKSHOP',
      domain: prog.domain || '',
      subDomain: prog.subDomain || '',
      location: prog.location || '',
      scale: prog.scale || 'OWN_INSTITUTE',
      startDate: formatForInput(prog.startDate),
      endDate: formatForInput(prog.endDate),
      participantsCount: prog.participantsCount || 0,
      description: prog.description || '',
      feeBased: prog.feeBased || false
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProg) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        participantsCount: parseInt(formData.participantsCount, 10) || 0
      };
      await updateProgramme(selectedProg.id, payload);
      setToast({ message: 'Programme updated successfully!', type: 'success' });
      setIsEditOpen(false);
      fetchProgrammes();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update programme.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLoading(true);
    try {
      await updateProgrammeStatus(id, newStatus);
      setToast({ message: `Programme status updated to ${newStatus}.`, type: 'success' });
      fetchProgrammes();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update status.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewInterests = async (prog) => {
    setSelectedProg(prog);
    setIsInterestsOpen(true);
    setInterestsLoading(true);
    try {
      const response = await getInterestsForProgramme(prog.id);
      setInterests(response.data);
    } catch (err) {
      setToast({ message: 'Failed to load interests.', type: 'error' });
    } finally {
      setInterestsLoading(false);
    }
  };

  const handleCloseDealClick = (eoi) => {
    setSelectedEoi(eoi);
    setDealData({ campusDeliverable: '', corporateDeliverable: '' });
    setIsCloseDealOpen(true);
  };

  const handleCloseDealSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEoi) return;
    setLoading(true);
    try {
      const payload = {
        eoiId: selectedEoi.id,
        campusDeliverable: dealData.campusDeliverable,
        corporateDeliverable: dealData.corporateDeliverable
      };
      await closeDeal(selectedEoi.id, payload);
      setToast({ message: 'Deal closed successfully! Email notifications sent.', type: 'success' });
      setIsCloseDealOpen(false);
      
      // Refresh interests list
      if (selectedProg) {
        const response = await getInterestsForProgramme(selectedProg.id);
        setInterests(response.data);
      }
      fetchProgrammes();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to close deal.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bglight flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-primary">My Programmes</h2>
            <p className="text-gray-500 mt-1">Manage and track your knowledge service offerings</p>
          </div>
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsAddOpen(true);
            }}
            className="px-5 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition duration-200"
          >
            Add Programme
          </button>
        </div>

        {loading && programmes.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : programmes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-150 shadow-sm p-8">
            <h3 className="text-xl font-bold text-primary mb-2">No programmes yet</h3>
            <p className="text-gray-500 mb-6">List your first seminar, hackathon, or workshop to invite corporate sponsorships!</p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition"
            >
              Create Programme
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map(prog => (
              <ProgrammeCard
                key={prog.id}
                programme={prog}
                actions={
                  <>
                    <button
                      onClick={() => handleViewInterests(prog)}
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition"
                    >
                      View Interests
                    </button>
                    <button
                      onClick={() => handleEditClick(prog)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-bold transition"
                    >
                      Edit
                    </button>
                    {prog.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusChange(prog.id, 'CLOSED')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition border border-red-200"
                      >
                        Close Programme
                      </button>
                    )}
                  </>
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Programme">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="SEMINAR">Seminar</option>
                <option value="SYMPOSIUM">Symposium</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="IDEATHON">Ideathon</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Scale</label>
              <select
                name="scale"
                value={formData.scale}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="NATIONAL">National</option>
                <option value="STATE">State</option>
                <option value="UNIVERSITY">University</option>
                <option value="OWN_INSTITUTE">Own Institute</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Domain</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
                placeholder="e.g. AI / Web Development"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sub Domain</label>
              <input
                type="text"
                name="subDomain"
                value={formData.subDomain}
                onChange={handleInputChange}
                placeholder="e.g. Natural Language Processing"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g. Auditorium / Remote"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Expected Participants</label>
              <input
                type="number"
                name="participantsCount"
                value={formData.participantsCount}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2 flex items-center">
              <input
                type="checkbox"
                name="feeBased"
                id="feeBasedAdd"
                checked={formData.feeBased}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="feeBasedAdd" className="ml-2 text-sm font-semibold text-gray-700">This is a fee-based program</label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition"
            >
              Add Programme
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Programme">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="SEMINAR">Seminar</option>
                <option value="SYMPOSIUM">Symposium</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="IDEATHON">Ideathon</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="OTHERS">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Scale</label>
              <select
                name="scale"
                value={formData.scale}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="NATIONAL">National</option>
                <option value="STATE">State</option>
                <option value="UNIVERSITY">University</option>
                <option value="OWN_INSTITUTE">Own Institute</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Domain</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sub Domain</label>
              <input
                type="text"
                name="subDomain"
                value={formData.subDomain}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Expected Participants</label>
              <input
                type="number"
                name="participantsCount"
                value={formData.participantsCount}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              ></textarea>
            </div>

            <div className="sm:col-span-2 flex items-center">
              <input
                type="checkbox"
                name="feeBased"
                id="feeBasedEdit"
                checked={formData.feeBased}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="feeBasedEdit" className="ml-2 text-sm font-semibold text-gray-700">This is a fee-based program</label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Interests Modal */}
      <Modal isOpen={isInterestsOpen} onClose={() => setIsInterestsOpen(false)} title={`Interests for ${selectedProg?.title || ''}`}>
        {interestsLoading ? (
          <div className="flex justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : interests.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-semibold">
            No interests expressed yet by any corporates for this program.
          </div>
        ) : (
          <div className="divide-y divide-gray-150">
            {interests.map(eoi => (
              <div key={eoi.id} className="py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-primary">{eoi.companyName}</h4>
                  <span className={`inline-block px-2 py-0.5 mt-1 rounded text-xs font-bold uppercase tracking-wider ${
                    eoi.status === 'CLOSED'
                      ? 'bg-gray-100 text-gray-800'
                      : eoi.status === 'MATCHED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {eoi.status}
                  </span>
                </div>
                <div>
                  {eoi.status !== 'CLOSED' && (
                    <button
                      onClick={() => handleCloseDealClick(eoi)}
                      className="px-3 py-1.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-bold transition shadow-sm"
                    >
                      Close Deal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Close Deal Sub-Modal */}
      <Modal isOpen={isCloseDealOpen} onClose={() => setIsCloseDealOpen(false)} title="Close Deal Agreement">
        <form onSubmit={handleCloseDealSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Confirm deal closure with <span className="font-bold text-primary">{selectedEoi?.companyName}</span> for program <span className="font-bold text-primary">"{selectedProg?.title}"</span>. Enter deliverables for both parties.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Campus Deliverable (What you provide)</label>
            <textarea
              value={dealData.campusDeliverable}
              onChange={(e) => setDealData(prev => ({ ...prev, campusDeliverable: e.target.value }))}
              required
              rows="3"
              placeholder="e.g. 10x10 booth space, key-note session speech slot, logo on flyer"
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Corporate Deliverable (What they provide)</label>
            <textarea
              value={dealData.corporateDeliverable}
              onChange={(e) => setDealData(prev => ({ ...prev, corporateDeliverable: e.target.value }))}
              required
              rows="3"
              placeholder="e.g. $500 sponsorship fee, 50x goodies bags for participants"
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsCloseDealOpen(false)}
              className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-bold transition shadow-sm"
            >
              Confirm Deal Closure
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <footer className="bg-primary text-gray-400 py-6 border-t border-primary-dark">
        <div className="max-w-7xl mx-auto text-center text-xs font-semibold">
          <p>&copy; {new Date().getFullYear()} KSEP. Powered by Millionminds.</p>
        </div>
      </footer>
    </div>
  );
};

export default CampusDashboard;
