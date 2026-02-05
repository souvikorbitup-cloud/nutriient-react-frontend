import React, { useEffect, useState } from "react";
import { BoxIconLine, GroupIcon, CategoryIcon, OrdersIcon } from "../../icons";
import { showError } from "../../Utils/toast";
import { getStats } from "../../api/admin-auth";
import AdminLoading from "./AdminLoading";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await getStats();
        if (mounted) {
          setStats(res?.data?.data);
        }
      } catch (error) {
        showError("Failed to fetch dashboard stats");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <AdminLoading />;

  const cards = [
    {
      label: "Total Customers",
      value: stats?.totalUsers ?? 0,
      icon: GroupIcon,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: BoxIconLine,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Total Categories",
      value: stats?.totalCategories ?? 0,
      icon: CategoryIcon,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: OrdersIcon,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 md:p-6"
          >
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-xl ${card.iconBg}`}
            >
              <Icon className={`size-8 ${card.iconColor}`} />
            </div>

            <div>
              <span className="text-sm text-gray-500">{card.label}</span>
              <h4 className="mt-2 text-2xl font-bold text-gray-800">
                {card.value}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDashboard;
