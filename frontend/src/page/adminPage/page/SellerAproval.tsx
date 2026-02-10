import  { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle,
  Loader2,
} from 'lucide-react';

// --- Types mapping your API response ---
interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  statutCompte: string; // "Pending", "Approved", or "Rejected"
  createdAt: string;
  canReceiveTransfers: boolean;
  stripeDetailsSubmitted: boolean;
  stripeOnboardingCompleted: boolean;
  transfersCapability: string;
  updatedAt: string;
  __v: number;
}

export default function VendorApprovals() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // tracks which seller ID is being actioned

  // Fetch Sellers Data
  useEffect(() => {
    async function fetchSellers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:4000/api/users/getAllSellers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sellers");
        }

        const data = await response.json();
        console.log("Sellers:", data);
        setSellers(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSellers();
  }, []);

  // --- Edit Status Handler (shared for Approve & Reject) ---
  const editSellerStatus = async (id: string, newStatus: string) => {
    try {
      setActionLoading(id); // show spinner on that row's buttons
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:4000/api/users/editStatusSeller/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ statutCompte: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update seller status to ${newStatus}`);
      }

      const updatedSeller = await response.json();
      console.log(`Seller ${id} updated to ${newStatus}:`, updatedSeller);

      // Update local state so UI reflects the change instantly
      setSellers(prev =>
        prev.map(seller =>
          seller._id === id
            ? { ...seller, statutCompte: newStatus }
            : seller
        )
      );
    } catch (error: any) {
      console.error("Error updating status:", error.message);
      alert(`Failed to update seller: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Action handlers
  const handleApprove = (id: string) => editSellerStatus(id, "Approved");
  const handleReject = (id: string) => editSellerStatus(id, "Rejected");

  // --- Helper Functions ---

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatus = (statutCompte: string): string => {
    switch (statutCompte) {
      case "Approved":
        return "Approved";
      case "Rejected":
        return "Rejected";
      default:
        return "Pending"; // covers "Pending", "false", or any unknown
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Dynamic summary counts
  const pendingCount = sellers.filter(s => getStatus(s.statutCompte) === 'Pending').length;
  const approvedCount = sellers.filter(s => getStatus(s.statutCompte) === 'Approved').length;
  const rejectedCount = sellers.filter(s => getStatus(s.statutCompte) === 'Rejected').length;

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve new vendor registration requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Approved</p>
              <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-rose-600">{rejectedCount}</p>
            </div>
            <div className="h-10 w-10 bg-rose-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-rose-600" />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Vendor Registrations</h2>
            <p className="text-sm text-gray-500 mt-1">Review vendor applications and details</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">Vendor / Store Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading vendors...
                      </div>
                    </td>
                  </tr>
                ) : sellers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No vendor registrations found.
                    </td>
                  </tr>
                ) : (
                  sellers.map((seller) => {
                    const status = getStatus(seller.statutCompte);
                    const isActioning = actionLoading === seller._id;

                    return (
                      <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {seller.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(seller.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium ${getStatusStyle(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isActioning ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            ) : (
                              <>
                                {/* Show Approve button if NOT already Approved */}
                                {status !== "Approved" && (
                                  <button 
                                    onClick={() => handleApprove(seller._id)}
                                    disabled={isActioning}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-medium rounded transition-colors shadow-sm disabled:opacity-50"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Approve
                                  </button>
                                )}

                                {/* Show Reject button if NOT already Rejected */}
                                {status !== "Rejected" && (
                                  <button 
                                    onClick={() => handleReject(seller._id)}
                                    disabled={isActioning}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-medium rounded transition-colors shadow-sm disabled:opacity-50"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Reject
                                  </button>
                                )}

                                
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}