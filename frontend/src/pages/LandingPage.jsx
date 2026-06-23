import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bglight flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-24 sm:py-32 text-white">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Connect Campuses with <span className="text-accent">Corporates</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-gray-200 max-w-3xl mx-auto mb-10">
              KSEP by Millionminds — where knowledge meets opportunity
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/register?role=CAMPUS"
                className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 duration-200 text-center"
              >
                I'm a Campus
              </Link>
              <Link
                to="/register?role=CORPORATE"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-primary rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 duration-200 text-center"
              >
                I'm a Corporate
              </Link>
            </div>
          </div>
        </section>

        {/* Feature section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-primary mb-4">How KSEP Works</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Empowering campuses and businesses to collaborate through educational events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">List Your Programme</h3>
              <p className="text-gray-600 leading-relaxed">
                Campuses can post workshops, seminars, hackathons, and symposiums, detailing their scale, participants, and schedule.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Browse the Pool</h3>
              <p className="text-gray-600 leading-relaxed">
                Corporates and startups filter programs by domain, location, or type, finding the ideal campus match to build brand presence.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Close the Deal</h3>
              <p className="text-gray-600 leading-relaxed">
                Startups express interest, matchmaking connects the stakeholders, and final agreements/deliverables are captured securely.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-gray-400 py-8 border-t border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} KSEP. Powered by Millionminds.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
