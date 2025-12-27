'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usersAPI } from '@/lib/api';
import { FiMapPin, FiMail, FiGithub, FiLinkedin, FiGlobe, FiUserPlus, FiMessageCircle } from 'react-icons/fi';

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchUser(params.id as string);
        }
    }, [params.id]);

    const fetchUser = async (id: string) => {
        try {
            const response = await usersAPI.getById(id);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">User not found</h2>
                    <Link href="/discover" className="btn-primary">Discover Users</Link>
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
                    <Link href="/discover" className="btn-ghost">← Back to Discover</Link>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Profile Header */}
                <div className="glass-card p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                        <img
                            src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
                            alt={user.name}
                            className="w-32 h-32 rounded-full border-4 border-primary-500"
                        />

                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-display font-bold mb-2">{user.name}</h1>
                                    <div className="flex items-center space-x-4 text-gray-400">
                                        <span className="badge badge-primary">{user.role}</span>
                                        {user.availableForWork && (
                                            <span className="badge badge-success">Available for work</span>
                                        )}
                                        {user.studentIdVerified && (
                                            <span className="badge bg-blue-500/20 text-blue-300">Verified Student</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="btn-primary flex items-center">
                                        <FiUserPlus className="mr-2" /> Follow
                                    </button>
                                    <Link href="/messages" className="btn-secondary flex items-center">
                                        <FiMessageCircle className="mr-2" /> Message
                                    </Link>
                                </div>
                            </div>

                            {user.bio && (
                                <p className="text-gray-300 mb-4">{user.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                {user.location && (
                                    <span className="flex items-center">
                                        <FiMapPin className="mr-2" /> {user.location}, {user.country}
                                    </span>
                                )}
                                {user.email && (
                                    <span className="flex items-center">
                                        <FiMail className="mr-2" /> {user.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    {(user.githubUrl || user.linkedinUrl || user.websiteUrl || user.portfolioUrl) && (
                        <div className="flex space-x-4 pt-6 mt-6 border-t border-dark-700">
                            {user.githubUrl && (
                                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center">
                                    <FiGithub className="mr-2" /> GitHub
                                </a>
                            )}
                            {user.linkedinUrl && (
                                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center">
                                    <FiLinkedin className="mr-2" /> LinkedIn
                                </a>
                            )}
                            {(user.websiteUrl || user.portfolioUrl) && (
                                <a href={user.websiteUrl || user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center">
                                    <FiGlobe className="mr-2" /> Portfolio
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Skills */}
                        {user.skills?.length > 0 && (
                            <div className="glass-card p-6">
                                <h2 className="text-2xl font-bold mb-4">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill: string, idx: number) => (
                                        <span key={idx} className="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 px-4 py-2">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Interests */}
                        {user.interests?.length > 0 && (
                            <div className="glass-card p-6">
                                <h2 className="text-2xl font-bold mb-4">Interests</h2>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map((interest: string, idx: number) => (
                                        <span key={idx} className="badge bg-dark-700 text-gray-300 px-4 py-2">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education (for students) */}
                        {user.university && (
                            <div className="glass-card p-6">
                                <h2 className="text-2xl font-bold mb-4">Education</h2>
                                <div className="bg-dark-800/50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg">{user.university}</h3>
                                    <p className="text-gray-400">{user.faculty}</p>
                                    {user.graduationYear && (
                                        <p className="text-sm text-gray-500 mt-2">Expected Graduation: {user.graduationYear}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4">Profile Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reputation</span>
                                    <span className="font-bold text-primary-400">{user.reputationScore || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Trust Score</span>
                                    <span className="font-bold text-primary-400">{user.trustScore?.toFixed(1) || '0.0'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Followers</span>
                                    <span className="font-bold">{user.followers?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Following</span>
                                    <span className="font-bold">{user.following?.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4">Status</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Availability</span>
                                    <span className={user.availableForWork ? 'text-green-400' : 'text-gray-400'}>
                                        {user.availableForWork ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Last Seen</span>
                                    <span className="text-gray-400">
                                        {new Date(user.lastSeen).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
