import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define Types
interface DailyData {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
}

interface TransformedDailyData {
  date: string;
  revenue: number;
  orders: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
}

export default function AdminChart1() {
  const [data, setData] = useState<MonthlyData[] | null>(null);
  const [datadaily, setDatadaily] = useState<TransformedDailyData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        // Fetch Daily Data
        const resDaily = await fetch(
          "http://localhost:4000/api/trend/trendDailyAdmin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!resDaily.ok) {
          throw new Error("Failed to fetch daily data");
        }

        const jsonDaily: DailyData[] = await resDaily.json();

        // Transform daily data for chart
        const transformedDaily: TransformedDailyData[] = jsonDaily.map((item) => ({
          date: item._id,
          revenue: item.totalRevenue,
          orders: item.totalOrders,
        }));
        setDatadaily(transformedDaily);

        // Fetch Monthly Data
        const resMonthly = await fetch(
          "http://localhost:4000/api/trend/trendMonthAdmin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!resMonthly.ok) {
          throw new Error("Failed to fetch monthly data");
        }

        const jsonMonthly: MonthlyData[] = await resMonthly.json();
        setData(jsonMonthly);

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Daily Revenue Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Daily Sell
        </h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={datadaily || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => value ? `$${value}` : ""}
              labelFormatter={(label) => label ? `Date: ${label}` : ""}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#1F6AF9"
              radius={[4, 4, 0, 0]}
              name="Sell ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Monthly Sells
        </h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => value ? `$${value}` : ""}
              labelFormatter={(label) => label ? `Month: ${label}` : ""}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#1F6AF9"
              radius={[4, 4, 0, 0]}
              name="Sells ($)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}