import { useEffect, useState } from 'react';

interface DashboardData {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  totalUsers: number;
  totalVenders: number;
}

export default function CardUi() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        const resDaily = await fetch(
          "http://localhost:4000/api/trend/getCardAdmin",
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

  const cards = [
    {
      title: "Total Orders",
      value: data?.totalOrders || 0,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Products",
      value: data?.totalProducts || 0,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Revenue",
      value: data?.totalRevenue ? `$${data.totalRevenue.toLocaleString()}` : "$0",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Users",
      value: data?.totalUsers || 0,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Seller",
      value: data?.totalVenders || 0,
      gradient: "from-blue-500 to-blue-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          {/* Content */}
          <div className="relative p-6 flex flex-col h-full">
            {/* Title */}
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">
              {card.title}
            </h3>

            {/* Value */}
            <div
              className={`text-3xl font-bold bg-linear-to-br ${card.gradient} bg-clip-text text-transparent`}
            >
              {card.value}
            </div>

            {/* Decorative Line */}
           
          </div>
        </div>
      ))}

      
    </div>
  );
}