import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProgrammeCard from '../components/ProgrammeCard';
import Toast from '../components/Toast';
import { browseProgrammes, expressInterest, getMyShortlist } from '../services/api';

const CorporateDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [programmes, setProgrammes] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Filters state
  const [filters, setFilters] = useState({
    domain: '',
    location: '',
    type: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      // Remove empty params
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          cleanFilters[key] = filters[key];
        }
      });
      const response = await browseProgrammes(cleanFilters);
      setProgrammes(response.data);
    } catch (err) {
      setToast({ message: 'Failed to search programmes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const response = await getMyShortlist();
      setShortlist(response.data);
    } catch (err) {
      setToast({ message: 'Failed to load shortlist.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchProgrammes();
    } else {
      fetchShortlist();
    }
  }, [activeTab]);

  const handleExpressInterest = async (progId) => {
    setLoading(true);
    try {
      await expressInterest(progId);
      setToast({ message: 'Interest expressed!', type: 'success' });
      // Refresh browse list or update state
      fetchProgrammes();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Already expressed interest.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MATCHED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-bglight flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-4 text-lg font-bold border-b-2 transition ${
                activeTab === 'browse'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}
            >
              Browse Programmes
            </button>
            <button
              onClick={() => setActiveTab('shortlist')}
              className={`pb-4 text-lg font-bold border-b-2 transition ${
                activeTab === 'shortlist'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}
            >
              My Shortlist
            </button>
          </div>
        </div>

        {activeTab === 'browse' ? (
          <div>
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Filter pool</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchProgrammes();
                }}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Domain</label>
                  <input
                    type="text"
                    name="domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                    placeholder="e.g. AI, Web"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="e.g. Remote, City"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="SYMPOSIUM">Symposium</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="IDEATHON">Ideathon</option>
                    <option value="HACKATHON">Hackathon</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>

            {loading && programmes.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : programmes.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-150 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-primary mb-1">No programmes match your search</h4>
                <p className="text-gray-500">Try modifying your filter parameters or search again.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programmes.map(prog => (
                  <ProgrammeCard
                    key={prog.id}
                    programme={prog}
                    actions={
                      <button
                        onClick={() => handleExpressInterest(prog.id)}
                        className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        Express Interest
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {loading && shortlist.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : shortlist.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-150 p-8 shadow-sm">
                <h4 className="text-lg font-bold text-primary mb-1">Your shortlist is empty</h4>
                <p className="text-gray-500">Go to Browse Programmes and express interest in events to sponsor them!</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Programme</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-150">
                      {shortlist.map(eoi => (
                        <tr key={eoi.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{eoi.companyName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{eoi.programmeTitle}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(eoi.status)}`}>
                              {eoi.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <footer className="bg-primary text-gray-400 py-6 border-t border-primary-dark">
        <div className="max-w-7xl mx-auto text-center text-xs font-semibold">
          <p>&copy; {new Date().getFullYear()} KSEP. Powered by Millionminds.</p>
        </div>
      </footer>
    </div>
  );
};

export default CorporateDashboard;
