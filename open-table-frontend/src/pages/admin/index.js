import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../AuthContext/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin dashboard cards will go here */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Restaurant Management</h2>
            <p className="text-gray-600">Manage restaurant details and settings</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Table Management</h2>
            <p className="text-gray-600">Manage table configurations and availability</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Booking Management</h2>
            <p className="text-gray-600">View and manage restaurant bookings</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 