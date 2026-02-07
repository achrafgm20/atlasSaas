import { useEffect, useState } from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { TrendingUp, TrendingDown } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Type definitions
interface MonthlyData {
  month: string
  revenue: number
  orders: number
}

interface MonthlyDataWithGrowth extends MonthlyData {
  growth: number | null
}

export default function SalesOverview() {
  const token = localStorage.getItem("token")
  const [data, SetData] = useState<MonthlyData[] | null>(null)
  
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await fetch("http://localhost:4000/api/trend/Trend", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        const data: MonthlyData[] = await res.json()
        SetData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [token])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Calculate growth percentages
  const dataWithGrowth: MonthlyDataWithGrowth[] = data.map((item, index) => {
    if (index === 0 || data[index - 1].revenue === 0) {
      return { ...item, growth: null }
    }
    const previousRevenue = data[index - 1].revenue
    const growth = ((item.revenue - previousRevenue) / previousRevenue) * 100
    return { ...item, growth }
  })

  // Filter out months with zero revenue for the table
  const activeMonths: MonthlyDataWithGrowth[] = dataWithGrowth.filter(
    (item) => item.revenue > 0
  )

  const totalRevenue: number = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders: number = data.reduce((sum, item) => sum + item.orders, 0)

  const revenueChartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: data.map((item) => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1
      }
    ]
  }

  const ordersChartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Orders',
        data: data.map((item) => item.orders),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  }

  const calculateAvgOrderValue = (revenue: number, orders: number): string => {
    return orders > 0 
      ? `$${(revenue / orders).toFixed(0)}` 
      : '$0'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Average Order Value</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {calculateAvgOrderValue(totalRevenue, totalOrders)}
          </p>
        </div>
      </div>

      {/* Recent Performance Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Recent Performance</h2>
          <p className="text-sm text-gray-500">Month-by-month breakdown</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Month
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Orders
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Avg Order Value
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {activeMonths.map((item, index) => {
                const avgOrderValue = item.orders > 0 
                  ? item.revenue / item.orders 
                  : 0
                
                return (
                  <tr 
                    key={`${item.month}-${index}`} 
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {item.month} 2024
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-blue-600">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {item.orders}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${avgOrderValue.toFixed(0)}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {item.growth === null ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span 
                          className={item.growth >= 0 
                            ? 'text-green-600 flex' 
                            : 'text-red-600 flex items-center gap-2'
                          }
                        >
                          {item.growth >= 0 ? <TrendingUp />: <TrendingDown />}  {Math.abs(item.growth).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <div style={{ height: '300px' }}>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Orders by Month</h2>
          <div style={{ height: '300px' }}>
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}