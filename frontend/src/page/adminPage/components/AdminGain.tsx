import { useEffect, useState } from "react";

interface AdminGainData {
  adminPercent: number;
  totalPlateFormGain: number;
}

export default function AdminGain() {
  const [data, setData] = useState<AdminGainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const resDaily = await fetch(
          "http://localhost:4000/api/trend/adminGain",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const jsonDaily = await resDaily.json();

        setData(jsonDaily);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-48 rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-blue-200 p-6">
          <h2 className="text-white text-2xl font-bold">Platform Earnings</h2>
          <p className="text-indigo-100 text-sm mt-1">Administrative revenue overview</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Gain Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative p-6 border-2 border-gray-100 rounded-xl hover:border-indigo-200 transition-colors duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    Total Platform Gain
                  </div>
                 
                </div>
                <div className="text-4xl font-bold bg-linear-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${data?.totalPlateFormGain?.toLocaleString() || 0}
                </div>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Admin Percent Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative p-6 border-2 border-gray-100 rounded-xl hover:border-emerald-200 transition-colors duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                    Admin Commission
                  </div>
                  
                </div>
                <div className="text-4xl font-bold bg-linear-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {data?.adminPercent || 0}%
                </div>
                <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000"
                    style={{ width: `${data?.adminPercent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              
              <div>
                <p className="text-sm text-gray-700">
                  The platform earns <span className="font-semibold text-indigo-600">{data?.adminPercent}%</span> commission 
                  on all transactions, resulting in a total revenue of{" "}
                  <span className="font-semibold text-indigo-600">
                    ${data?.totalPlateFormGain?.toLocaleString()}
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}