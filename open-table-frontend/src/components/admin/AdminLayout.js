import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminLayout = ({ children }) => {
  const router = useRouter();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
    { path: '/admin/tables', label: 'Tables', icon: '🪑' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === item.path ? 'bg-gray-100' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 