"use client";

import { useEffect } from 'react';
import { UserGroupIcon, UserIcon, UserMinusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
// import { useDashboardStats } from '@/hooks/useApi';/
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { usePermissions } from '@/hooks/usePermissions';

export default function DashboardPage() {
  // TODO: Replace with real data fetching hook, e.g. useDashboardStats
  const stats = null;
  const loading = false;
  const { isSuperAdmin, currentUser } = usePermissions();
  const fetchStats = () => {
    // Placeholder: implement fetch logic here
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const fallbackTopUsers = [
    { id: 1, name: "Amami", gender: "Male", days: 371, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Naomi", gender: "Male", days: 263, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Blessing", gender: "Male", days: 211, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Benedict", gender: "Male", days: 117, avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Annie", gender: "Male", days: 47, avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "Annie", gender: "Male", days: 47, avatar: "https://i.pravatar.cc/150?img=6" },
  ];

  const fallbackTrendingWords = [
    { id: 1, word: "Isabato", searches: 87, avatar: "https://i.pravatar.cc/100?img=11" },
    { id: 2, word: "Ìgho", searches: 51, avatar: "https://i.pravatar.cc/100?img=12" },
    { id: 3, word: "Oyono", searches: 50, avatar: "https://i.pravatar.cc/100?img=13" },
    { id: 4, word: "Oghriki", searches: 41, avatar: "https://i.pravatar.cc/100?img=14" },
  ];

  const dashboardStats = [
    {
      label: 'Total Users',
      // value?: stats?.totalUsers?.toLocaleString(),
      change: '+50%',
      changeType: 'up' as const,
      sub: 'Last year (6,000)',
      icon: UserGroupIcon,
      iconColor: 'text-white',
      changeColor: 'text-green-400',
    },
    {
      label: 'Active Users',
      // value?: stats && 'activeUsers' in stats && typeof stats.activeUsers === 'number'
      //   ? stats.activeUsers.toLocaleString()
      //   : '0',
      change: '-50%',
      changeType: 'down' as const,
      sub: 'Last year (9,254)',
      icon: UserIcon,
      iconColor: 'text-white',
      changeColor: 'text-red-400',
    },
    {
      label: 'Deleted Users',
      // value: stats?.deletedUsers.toLocaleString(),
      change: '+9.2%',
      changeType: 'up' as const,
      sub: 'Last year (125)',
      icon: UserMinusIcon,
      iconColor: 'text-white',
      changeColor: 'text-green-400',
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#1F1F27]">
      <div className="w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
            {/* Overview Section - Only show for super_admin */}
            {isSuperAdmin && (
              <section className="w-full rounded-[20px] bg-[#1E1E1E] p-6 md:p-8 lg:pt-11 lg:pr-6 lg:pb-11 lg:pl-6 shadow flex flex-col gap-8">
                <h2 className="text-xl font-semibold text-white">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {dashboardStats.map((stat) => (
                    <div key={stat.label} className="w-full h-[144px] rounded-[15px] pt-6 pr-3 pb-6 pl-3 bg-[#1F1F27] flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
                        <span className="text-lg font-medium text-white">{stat.label}</span>
                      </div>
                      <div className="flex items-end gap-2">
                        {/* <span className="text-2xl font-bold text-white">{stat.value}</span> */}
                        <span className={`${stat.changeColor} text-sm font-semibold flex items-center gap-1`}>
                          {stat.changeType === 'up' ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />} {stat.change}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{stat.sub}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Top Users Section - Only show for super_admin */}
            {isSuperAdmin && (
              <section className="w-full rounded-[20px] bg-[#1E1E1E] p-6 md:p-8 shadow">
                <h2 className="text-xl font-semibold text-white mb-6">Top Users</h2>
                <ul className="space-y-4">
                  {(fallbackTopUsers).map((user, idx) => (
                    <li
                      key={user.id || idx}
                      className="flex items-center justify-between py-3 border-b border-[#23232a] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.gender}</div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{user.days} Days</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Recent Users Section - Only show for super_admin */}
            {isSuperAdmin && (
              <section className="w-full rounded-[20px] bg-[#1E1E1E] p-6 md:p-8 shadow">
                <h2 className="text-xl font-semibold text-white mb-6">Recent Users</h2>
                <ul className="space-y-4">
                  {(stats && Array.isArray((stats as any).recentUsers) ? (stats as any).recentUsers : []).map((user: any, idx: number) => (
                    <li key={user.id || idx} className="flex items-center justify-between py-3 border-b border-[#23232a] last:border-b-0">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Trending Words - Only show for super_admin */}
          {isSuperAdmin && (
            <aside className="w-full lg:w-[380px] shrink-0">
              <div className="rounded-[20px] bg-[#1E1E1E] p-6 md:p-8 shadow lg:h-[95vh]">
                <h2 className="text-xl font-semibold text-white mb-6">Trending Words</h2>
                <ul className="space-y-4">
                  {(fallbackTrendingWords).map((word, idx) => (
                    <li
                      key={word.id || idx}
                      className="flex items-center justify-between py-3 border-b border-[#23232a] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={word.avatar}
                          alt={word.word}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="text-white font-medium">{word.word}</div>
                      </div>
                      <span className="text-gray-400 text-sm">{word.searches} Searches</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
} 