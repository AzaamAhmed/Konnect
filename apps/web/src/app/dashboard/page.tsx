'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, postsAPI } from '@/lib/api';
import { FiTrendingUp, FiUsers, FiMessageCircle, FiBriefcase, FiMapPin, FiPlus } from 'react-icons/fi';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0, applications: 0 });
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }

                const [userRes, postsRes] = await Promise.all([
                    authAPI.getMe(),
                    postsAPI.getAll({}, 1),
                ]);

                setUser(userRes.data);
                setRecommendations(postsRes.data.posts.slice(0, 5));

                // Mock stats (would come from API in real app)
                setStats({
                    followers: Math.floor(Math.random() * 100),
                    following: Math.floor(Math.random() * 50),
                    posts: Math.floor(Math.random() * 10),
                    applications: Math.floor(Math.random() * 20),
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-card border-b border-dark-700 sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-white">K</span>
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text">Konnect</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/ideas" className="btn-ghost">Ideas</Link>
                        <Link href="/discover" className="btn-ghost">Discover</Link>
                        <Link href="/resources" className="btn-ghost">Resources</Link>
                        <Link href="/messages" className="btn-ghost">Messages</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/ideas/new" className="btn-primary">
                            <FiPlus className="mr-2" /> Post Idea
                        </Link>
                        <img
                            src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full border-2 border-primary-500"
                        />
                    </div>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-gray-400">Here's what's happening in your network</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={<FiUsers />} label="Followers" value={stats.followers} />
                    <StatCard icon={<FiTrendingUp />} label="Following" value={stats.following} />
                    <StatCard icon={<FiBriefcase />} label="Posts" value={stats.posts} />
                    <StatCard icon={<FiMessageCircle />} label="Applications" value={stats.applications} />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recommended Posts */}
                        <div className="glass-card p-6">
                            <h2 className="text-2xl font-display font-bold mb-4">Recommended for You</h2>
                            <div className="space-y-4">
                                {recommendations.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                            <Link href="/ideas" className="btn-secondary w-full mt-4 inline-block text-center">
                                View All Ideas
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="glass-card p-6">
                            <div className="text-center mb-4">
                                <img
                                    src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
                                    alt={user?.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-500"
                                />
                                <h3 className="font-bold text-lg">{user?.name}</h3>
                                <p className="text-sm text-gray-400">{user?.role}</p>
                                {user?.location && (
                                    <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
                                        <FiMapPin className="mr-1" /> {user.location}
                                    </p>
                                )}
                            </div>
                            <Link href={`/profile/${user?.id}`} className="btn-secondary w-full">
                                View Profile
                            </Link>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link href="/ideas/new" className="block btn-ghost w-full text-left">
                                    Post New Idea
                                </Link>
                                <Link href="/discover" className="block btn-ghost w-full text-left">
                                    Find Collaborators
                                </Link>
                                <Link href="/resources" className="block btn-ghost w-full text-left">
                                    Browse Resources
                                </Link>
                                <Link href="/groups" className="block btn-ghost w-full text-left">
                                    Join Groups
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
    return (
        <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold gradient-text">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
        </div>
    );
}

function PostCard({ post }: { post: any }) {
    return (
        <Link href={`/ideas/${post.id}`} className="block glass-card p-4 hover-lift border border-dark-700">
            <div className="flex items-start space-x-3">
                <img
                    src={post.author?.avatar}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">{post.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {post.techStack?.slice(0, 3).map((tech: string, idx: number) => (
                            <span key={idx} className="badge badge-primary text-xs">{tech}</span>
                        ))}
                        {post.city && (
                            <span className="badge badge-success text-xs">
                                <FiMapPin className="mr-1" /> {post.city}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
