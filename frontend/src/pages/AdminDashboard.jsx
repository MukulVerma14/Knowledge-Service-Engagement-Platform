import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import Toast from '../components/Toast';
import { 
  getAdminStats, 
  getAdminProgrammes, 
  getAdminDeals, 
  getAdminCorporates 
} from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProgrammes: 0,
    dealsClosed: 0,
    activeExpressions: 0
  });
  
  const [activeTab, setActiveTab] = useState('programmes');
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchStats = async () => {
    try {
      const response = await getAdminStats();
      setStats(response.data);
    } catch (err) {
      setToast({ message: 'Failed to load stats.', type: 'error' });
    }
  };

  const fetchDataList = async (tab) => {
    setLoading(true);
    try {
      let response;
      if (tab === 'programmes') {
        response = await getAdminProgrammes();
      } else if (tab === 'deals') {
        response = await getAdminDeals();
      } else {
        response = await getAdminCorporates();
      }
      setDataList(response.data);
    } catch (err) {
      setToast({ message: `Failed to load ${tab}.`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchDataList(activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-bglight flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-primary">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Platform overview and data management</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Active Programmes" 
            value={stats.totalProgrammes} 
            color="primary" 
          />
          <StatCard 
            title="Deals Closed" 
            value={stats.dealsClosed} 
            color="green" 
          />
          <StatCard 
            title="Active Expressions" 
            value={stats.activeExpressions} 
            color="accent" 
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('programmes')}
            className={`pb-4 text-base font-bold border-b-2 mr-8 transition ${
              activeTab === 'programmes'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            Programmes
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`pb-4 text-base font-bold border-b-2 mr-8 transition ${
              activeTab === 'deals'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            Deals
          </button>
          <button
            onClick={() => setActiveTab('corporates')}
            className={`pb-4 text-base font-bold border-b-2 transition ${
              activeTab === 'corporates'
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-500 hover:text-primary'
            }`}
          >
            Corporates
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : dataList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-150 p-8 shadow-sm">
            <h4 className="text-lg font-bold text-primary mb-1">No data available</h4>
            <p className="text-gray-500">There are currently no records for {activeTab} in the system.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-150 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === 'programmes' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campus Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-150">
                    {dataList.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{p.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{p.campusName}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{p.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{p.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.domain}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            p.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'deals' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Programme Title</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Corporate Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campus Deliverable</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Corporate Deliverable</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-150">
                    {dataList.map(d => (
                      <tr key={d.dealId} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{d.dealId}</td>
                        <td className="px-6 py-4 text-sm font-bold text-primary">{d.programmeTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{d.corporateName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{d.campusDeliverable}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{d.corporateDeliverable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'corporates' && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-150">
                    {dataList.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">{c.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{c.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{c.companyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{c.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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

export default AdminDashboard;
