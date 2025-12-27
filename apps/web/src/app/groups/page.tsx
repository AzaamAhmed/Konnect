'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { groupsAPI } from '@/lib/api';
import { FiUsers, FiSearch, FiPlus, FiMessageSquare } from 'react-icons/fi';

export default function GroupsPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await groupsAPI.getAll();
            setGroups(response.data);
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <header className="glass-card border-b border-dark-700 sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-xl font-bold font-display gradient-text">Konnect</Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/groups/new" className="btn-primary flex items-center">
                            <FiPlus className="mr-2" /> Create Group
                        </Link>
                    </div>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-bold mb-4">Community <span className="gradient-text">Groups</span></h1>
                    <p className="text-gray-400">Join communities of like-minded founders, developers, and students.</p>
                </div>

                {/* Search */}
                <div className="max-w-xl mx-auto mb-10 relative">
                    <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search groups..."
                        className="input-primary w-full pl-12"
                    />
                </div>

                {/* Groups Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-center col-span-full">Loading groups...</p>
                    ) : groups.map((group) => (
                        <Link key={group.id} href={`/groups/${group.id}`} className="glass-card p-6 hover-lift border border-dark-700 block">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-16 h-16 rounded-xl bg-dark-800 flex items-center justify-center overflow-hidden">
                                    {group.avatar ? (
                                        <img src={group.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-600">{group.name.charAt(0)}</span>
                                    )}
                                </div>
                                <span className="badge badge-primary">{group.category || 'General'}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2">{group.description}</p>

                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-dark-700">
                                <div className="flex items-center">
                                    <FiUsers className="mr-2" /> {group.memberCount} members
                                </div>
                                <div className="flex items-center">
                                    <FiMessageSquare className="mr-2" /> Active now
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
