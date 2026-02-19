import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, ChevronDown, Search, Trash2 } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role:  'Seller' | 'Buyer';
  statutCompte: string;
  createdAt?: string;
  updatedAt?: string;
  storeName?: string;
  storeDescription?: string;
  phone?: string;
  adresse?: string;
  city?: string;
  postalCode?: string;
  Country?: string;
  stripeAccountId?: string;
  stripeOnboardingCompleted?: boolean;
  stripeDetailsSubmitted?: boolean;
  canReceiveTransfers?: boolean;
  transfersCapability?: string;
  lastStripeSync?: string;
  stripeOnboardingUrl?: string;
  __v?: number;
}

type RoleFilter = 'All Roles' | 'Buyer' | 'Seller' ;

const BuyerSellerPage: React.FC = () => {
  
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('All Roles');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

   
  // Fetch users from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:4000/api/users/getAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await response.json();
        
        setUsers(data);
        
        // Get current user role from token or localStorage
        // const userRole = localStorage.getItem("userRole");
        // setCurrentUserRole(userRole);
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : "Unknown error");
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);
console.log(users)
  // Check if navigation came with state (filter)
  useEffect(() => {
    if (location.state?.filter === 'vendors') {
      setSelectedRole('Seller');
    }
  }, [location.state]);

  // Delete user function
  const handleDeleteUser = async (userId: string): Promise<void> => {
    // Check if current user is admin
    // if (currentUserRole !== 'Admin') {
    //   alert('Only administrators can delete users');
    //   return;
    // }

    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:4000/api/users/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove user from state
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully');
      
    } catch (error) {
      console.error("Error deleting user:", error instanceof Error ? error.message : "Unknown error");
      alert('Failed to delete user. Please try again.');
    }
  };

  // Filter users based on role and search query
  const filteredUsers = users.filter(user => {
    const roleMatch = selectedRole === 'All Roles' || user.role === selectedRole;
    
    const searchMatch = searchQuery === '' || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return roleMatch && searchMatch;
  });

  const getRoleBadgeClass = (role: string): string => {
    switch(role) {
      
      case 'Seller': 
        return 'bg-blue-100 text-blue-700';
      case 'Buyer':
        return 'bg-green-100 text-green-700';
      default: 
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get avatar color based on role
  const getAvatarColor = (role: string): string => {
    switch(role) {
      
      case 'Seller': 
        return 'bg-blue-500';
      case 'Buyer':
        return 'bg-green-500';
      default: 
        return 'bg-gray-500';
    }
  };

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or store..."
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
              onChange={(e) => setSelectedRole(e.target.value as RoleFilter)}
              className="appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>All Roles</option>
              <option>Buyer</option>
              <option>Seller</option>
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
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.role)} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        {user.storeName && (
                          <span className="text-xs text-gray-500">{user.storeName}</span>
                        )}
                      </div>
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
                      user.role === 'Buyer' || (user.statutCompte === 'Approved' && user.role === 'Seller')
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.role === 'Buyer' || user.statutCompte === "Approved" ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors text-sm font-medium"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                    
                    </div>
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