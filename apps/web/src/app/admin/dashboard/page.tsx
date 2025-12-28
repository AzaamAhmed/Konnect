'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { FiUsers, FiFileText, FiCalendar, FiActivity, FiCheck, FiTrash2, FiSearch } from 'react-icons/fi';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getAllUsers(1, 10),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId: string) => {
        if (confirm('Verify this user as a student?')) {
            try {
                await adminAPI.verifyUser(userId);
                fetchData(); // Refresh
            } catch (error) {
                console.error('Verify failed:', error);
            }
        }
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await adminAPI.deleteUser(userId);
                fetchData(); // Refresh
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

    return (
        <div className="min-h-screen bg-dark-900">
            <header className="glass-card border-b border-dark-700">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-xl font-bold font-display gradient-text">Konnect Admin</Link>
                    <Link href="/dashboard" className="btn-ghost">Exit to App</Link>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<FiUsers />} label="Total Users" value={stats?.overview?.totalUsers} color="text-blue-400" />
                    <StatCard icon={<FiFileText />} label="Total Posts" value={stats?.overview?.totalPosts} color="text-green-400" />
                    <StatCard icon={<FiActivity />} label="Groups" value={stats?.overview?.totalGroups} color="text-purple-400" />
                    <StatCard icon={<FiCalendar />} label="Events" value={stats?.overview?.totalEvents} color="text-orange-400" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Users Table */}
                    <div className="lg:col-span-2 glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-dark-700 text-gray-400 text-sm">
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Role</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {users.map((user) => (
                                        <tr key={user.id} className="text-sm">
                                            <td className="py-3 items-center flex space-x-3">
                                                <img
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <p className="font-bold">{user.name}</p>
                                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 text-gray-300">{user.role}</td>
                                            <td className="py-3">
                                                {user.studentIdVerified ? (
                                                    <span className="badge badge-success text-xs">Verified</span>
                                                ) : (
                                                    <span className="badge bg-dark-700 text-gray-500 text-xs">Unverified</span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex space-x-2">
                                                    {!user.studentIdVerified && user.role === 'STUDENT' && (
                                                        <button onClick={() => handleVerify(user.id)} className="text-green-400 hover:text-green-300">
                                                            <FiCheck />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* User Distribution */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-4">User Distribution</h2>
                        <div className="space-y-4">
                            {Object.entries(stats?.userDistribution || {}).map(([role, count]: [string, any]) => (
                                <div key={role} className="flex justify-between items-center">
                                    <span className="text-gray-400 capitalize">{role.toLowerCase()}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-500"
                                                style={{ width: `${(count / stats.overview.totalUsers) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="font-bold text-sm">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className="glass-card p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-dark-800 ${color} text-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-2xl font-bold">{value ?? 0}</p>
            </div>
        </div>
    );
}
