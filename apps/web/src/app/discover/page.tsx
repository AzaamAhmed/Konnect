'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usersAPI } from '@/lib/api';
import { FiMapPin, FiFilter, FiNavigation } from 'react-icons/fi';

export default function DiscoverPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [filters, setFilters] = useState({ role: '', city: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserLocation();
        fetchUsers();
    }, [filters]);

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error('Geolocation error:', error)
            );
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.search(searchQuery, filters);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyUsers = async () => {
        if (!userLocation) return;

        try {
            setLoading(true);
            const response = await usersAPI.getNearby(userLocation.lat, userLocation.lng, 50);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch nearby users:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display font-bold mb-2">
                            <span className="gradient-text">Discover</span> Collaborators
                        </h1>
                        <p className="text-gray-400">Find talented people to work with across Sri Lanka</p>
                    </div>
                    {userLocation && (
                        <button onClick={fetchNearbyUsers} className="btn-primary flex items-center">
                            <FiNavigation className="mr-2" /> Find Nearby
                        </button>
                    )}
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Filters */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24">
                            <div className="flex items-center space-x-2 mb-4">
                                <FiFilter className="text-primary-400" />
                                <h3 className="font-bold">Filters</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Search</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                                        placeholder="Skills, name, interests..."
                                        className="input-field text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Role</label>
                                    <select
                                        value={filters.role}
                                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="FOUNDER">Founder</option>
                                        <option value="DEVELOPER">Developer</option>
                                        <option value="STUDENT">Student</option>
                                        <option value="MENTOR">Mentor</option>
                                        <option value="INVESTOR">Investor</option>
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
                                        <option value="Jaffna">Jaffna</option>
                                    </select>
                                </div>

                                <button onClick={() => setFilters({ role: '', city: '' })} className="btn-ghost w-full text-sm">
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Users Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400">Finding collaborators...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12 glass-card">
                                <p className="text-gray-400 text-lg">No users found. Try different filters.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {users.map((user: any) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserCard({ user }: { user: any }) {
    return (
        <Link href={`/profile/${user.id}`} className="glass-card p-6 hover-lift border border-dark-700">
            <div className="flex items-start space-x-4">
                <img
                    src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-primary-500"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{user.role}</p>

                    {user.bio && (
                        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{user.bio}</p>
                    )}

                    {user.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {user.skills.slice(0, 3).map((skill: string, idx: number) => (
                                <span key={idx} className="badge bg-primary-500/20 text-primary-300 text-xs">
                                    {skill}
                                </span>
                            ))}
                            {user.skills.length > 3 && (
                                <span className="badge bg-dark-700 text-gray-400 text-xs">
                                    +{user.skills.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        {user.city && (
                            <span className="flex items-center text-gray-400">
                                <FiMapPin className="mr-1 text-xs" /> {user.city}
                            </span>
                        )}
                        {user.availableForWork && (
                            <span className="badge badge-success text-xs">Available</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
