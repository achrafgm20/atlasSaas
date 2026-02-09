


import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {  Filter, MoreVertical, ChevronDown } from 'lucide-react';

const BuyerSellerPage = () => {
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');

  // Check if navigation came with state (filter)
  useEffect(() => {
    if (location.state?.filter === 'vendors') {
      setSelectedRole('Vendor');
    }
  }, [location.state]);

  const users = [
    { id: 1, name: 'Alice Thompson', email: 'alice@email.com', role: 'User', status: 'Active', dateJoined: 'Jan 15, 2026', avatar: 'A', avatarColor: 'bg-purple-500' },
    { id: 2, name: 'John Smith', email: 'john@techgear.com', role: 'Vendor', status: 'Active', dateJoined: 'Jan 10, 2026', avatar: 'J', avatarColor: 'bg-blue-500' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah@fashionhub.com', role: 'Vendor', status: 'Active', dateJoined: 'Dec 28, 2025', avatar: 'S', avatarColor: 'bg-pink-500' },
    { id: 4, name: 'Admin User', email: 'admin@atlastech.com', role: 'Admin', status: 'Active', dateJoined: 'Dec 1, 2025', avatar: 'A', avatarColor: 'bg-purple-600' },
    { id: 5, name: 'Bob Martinez', email: 'bob@email.com', role: 'User', status: 'Active', dateJoined: 'Feb 1, 2026', avatar: 'B', avatarColor: 'bg-indigo-500' },
    { id: 6, name: 'Michael Chen', email: 'michael@homeandgarden.com', role: 'Vendor', status: 'Active', dateJoined: 'Jan 20, 2026', avatar: 'M', avatarColor: 'bg-green-500' },
    { id: 7, name: 'Emily Davis', email: 'emily@sportsplus.com', role: 'Vendor', status: 'Active', dateJoined: 'Jan 5, 2026', avatar: 'E', avatarColor: 'bg-orange-500' },
    { id: 8, name: 'Carol White', email: 'carol@email.com', role: 'User', status: 'Inactive', dateJoined: 'Dec 15, 2025', avatar: 'C', avatarColor: 'bg-red-500' },
    { id: 9, name: 'David Wilson', email: 'david@bookhaven.com', role: 'Vendor', status: 'Active', dateJoined: 'Jan 25, 2026', avatar: 'D', avatarColor: 'bg-teal-500' },
    { id: 10, name: 'Daniel Brown', email: 'daniel@email.com', role: 'User', status: 'Active', dateJoined: 'Feb 3, 2026', avatar: 'D', avatarColor: 'bg-cyan-500' },
  ];

  const filteredUsers = users.filter(user => {
    const roleMatch = selectedRole === 'All Roles' || user.role === selectedRole;
    
    const searchMatch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return roleMatch  && searchMatch;
  });

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Admin': 
        return 'bg-pink-100 text-pink-700';
      case 'Vendor': 
        return 'bg-blue-100 text-blue-700';
      default: 
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users & Vendors</h1>
        <p className="text-gray-600 mt-2">Manage all platform users, vendors, and administrators</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Box */}
        <div className="flex-1 max-w-md relative">
         
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} className="text-gray-600" />
          </button>

          <div className="relative">
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Roles</option>
              <option>User</option>
              <option>Vendor</option>
              <option>Admin</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">All Users & Vendors</h3>
          <p className="text-sm text-gray-600 mt-1">Total: {filteredUsers.length} users</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                        {user.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{user.dateJoined}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No users found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerSellerPage;