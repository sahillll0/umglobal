'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Package, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    todayEnquiries: 0,
    monthEnquiries: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentEnquiries(data.recentEnquiries || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Products', 
      value: stats.totalProducts, 
      icon: Package, 
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Published Products', 
      value: stats.publishedProducts, 
      icon: Eye, 
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    { 
      label: 'Draft Products', 
      value: stats.draftProducts, 
      icon: AlertCircle, 
      color: 'bg-amber-500',
      textColor: 'text-amber-600'
    },
    { 
      label: 'Total Enquiries', 
      value: stats.totalEnquiries, 
      icon: MessageSquare, 
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    { 
      label: 'New Enquiries', 
      value: stats.newEnquiries, 
      icon: TrendingUp, 
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    { 
      label: 'Today\'s Enquiries', 
      value: stats.todayEnquiries, 
      icon: Calendar, 
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'This Month', 
      value: stats.monthEnquiries, 
      icon: Clock, 
      color: 'bg-teal-500',
      textColor: 'text-teal-600'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      in_progress: 'bg-purple-100 text-purple-700',
      quoted: 'bg-indigo-100 text-indigo-700',
      converted: 'bg-green-100 text-green-700',
      closed: 'bg-slate-100 text-slate-700',
      spam: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.new;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600">
              Welcome to UM Global Exim management portal
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-8 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${card.color} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${card.textColor}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        {card.label}
                      </p>
                      <p className="text-3xl font-extrabold text-slate-900">
                        {card.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent Enquiries */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Recent Enquiries</h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : recentEnquiries.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No enquiries yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                        Enquiry ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                        Received
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentEnquiries.map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-semibold text-[#0F5132]">
                            {enquiry.enquiryId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {enquiry.name}
                            </p>
                            <p className="text-xs text-slate-500">{enquiry.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-700">
                            {enquiry.product || 'General Inquiry'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(enquiry.status)}`}>
                            {enquiry.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {recentEnquiries.length > 0 && (
              <div className="p-4 border-t border-slate-100 text-center">
                <a
                  href="/admin/enquiries"
                  className="text-sm font-semibold text-[#0F5132] hover:text-[#093822]"
                >
                  View All Enquiries →
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
