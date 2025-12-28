'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postsAPI } from '@/lib/api';
import { FiMapPin, FiDollarSign, FiUsers, FiFilter, FiSearch } from 'react-icons/fi';

export default function IdeasPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ type: '', category: '', city: '', isPaid: '' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [filters]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postsAPI.getAll(filters, 1);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                    <div className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search ideas, tasks, opportunities..."
                                className="input-field pl-12 w-full"
                            />
                        </div>
                    </div>

                    <Link href="/dashboard" className="btn-ghost">Back</Link>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">
                            Explore <span className="gradient-text">Ideas</span>
                        </h1>
                        <p className="text-gray-400">Discover opportunities and collaborations</p>
                    </div>
                    <Link href="/ideas/new" className="btn-primary">Post New Idea</Link>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24">
                            <div className="flex items-center space-x-2 mb-4">
                                <FiFilter className="text-primary-400" />
                                <h3 className="font-bold">Filters</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Type</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All Types</option>
                                        <option value="IDEA">Idea</option>
                                        <option value="TASK">Task</option>
                                        <option value="REQUEST">Request</option>
                                        <option value="MENTORSHIP">Mentorship</option>
                                        <option value="FUNDING">Funding</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Technology">Technology</option>
                                        <option value="FinTech">FinTech</option>
                                        <option value="EdTech">EdTech</option>
                                        <option value="HealthTech">HealthTech</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <select
                                        value={filters.city}
                                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All Locations</option>
                                        <option value="Colombo">Colombo</option>
                                        <option value="Kandy">Kandy</option>
                                        <option value="Galle">Galle</option>
                                        <option value="Moratuwa">Moratuwa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.isPaid === 'true'}
                                            onChange={(e) => setFilters({ ...filters, isPaid: e.target.checked ? 'true' : '' })}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Paid opportunities only</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => setFilters({ type: '', category: '', city: '', isPaid: '' })}
                                    className="btn-ghost w-full text-sm"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading ideas...</p>
                            </div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="text-center py-12 glass-card">
                                <p className="text-gray-400 text-lg">No ideas found matching your criteria</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {filteredPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostCard({ post }: { post: any }) {
    return (
        <Link href={`/ideas/${post.id}`} className="block glass-card p-6 hover-lift border border-dark-700">
            <div className="flex items-start space-x-4">
                <img
                    src={post.author?.avatar}
                    alt={post.author?.name}
                    className="w-14 h-14 rounded-full border-2 border-primary-500"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="text-xl font-bold mb-1">{post.title}</h2>
                            <p className="text-sm text-gray-400">
                                by {post.author?.name} • {post.author?.role}
                            </p>
                        </div>
                        {post.isPaid && (
                            <span className="badge bg-green-500/20 text-green-300 border-green-500/30">
                                <FiDollarSign className="mr-1" /> Paid
                            </span>
                        )}
                    </div>

                    <p className="text-gray-300 mb-4 line-clamp-2">{post.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.type && <span className="badge badge-primary">{post.type}</span>}
                        {post.category && <span className="badge badge-primary">{post.category}</span>}
                        {post.techStack?.slice(0, 4).map((tech: string, idx: number) => (
                            <span key={idx} className="badge bg-dark-700 text-gray-300">{tech}</span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                            {post.city && (
                                <span className="flex items-center">
                                    <FiMapPin className="mr-1" /> {post.city}
                                </span>
                            )}
                            {post.lookingFor && (
                                <span className="flex items-center">
                                    <FiUsers className="mr-1" /> Looking for: {post.lookingFor.join(', ')}
                                </span>
                            )}
                        </div>
                        <span>{post.viewCount || 0} views</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
