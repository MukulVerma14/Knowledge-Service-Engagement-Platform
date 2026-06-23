import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-150 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black text-primary tracking-wider hover:text-accent transition duration-200">
                KSEP
              </span>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                by Millionminds
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {auth.token ? (
              <>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hidden sm:inline-block">
                  Role: <span className="font-bold text-primary">{auth.role === 'SUPER_ADMIN' ? 'ADMIN' : auth.role}</span>
                </span>
                
                {auth.role === 'CAMPUS' && (
                  <Link to="/campus/dashboard" className="text-sm font-semibold text-primary hover:text-accent transition">
                    Dashboard
                  </Link>
                )}
                {auth.role === 'CORPORATE' && (
                  <Link to="/corporate/dashboard" className="text-sm font-semibold text-primary hover:text-accent transition">
                    Dashboard
                  </Link>
                )}
                {auth.role === 'SUPER_ADMIN' && (
                  <Link to="/admin/dashboard" className="text-sm font-semibold text-primary hover:text-accent transition">
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="bg-accent text-white hover:bg-accent-dark px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary hover:text-accent text-sm font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
