'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiDownload, FiStar, FiMessageCircle, FiFilter, FiUpload } from 'react-icons/fi';

export default function ResourcesPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [filters, setFilters] = useState({ university: '', category: '', semester: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - would fetch from API
        setResources([
            {
                id: '1',
                title: 'Data Structures & Algorithms - Lecture Slides',
                category: 'LECTURE_SLIDES',
                university: 'University of Moratuwa',
                faculty: 'Computer Science',
                courseCode: 'CS2012',
                semester: 3,
                fileType: 'pdf',
                downloadCount: 234,
                rating: 4.5,
                reviewCount: 12,
            },
            {
                id: '2',
                title: 'Web Development Lab Sheet 01',
                category: 'LAB_SHEETS',
                university: 'SLIIT',
                faculty: 'IT',
                courseCode: 'IT3020',
                semester: 5,
                fileType: 'pdf',
                downloadCount: 189,
                rating: 4.8,
                reviewCount: 8,
            },
            {
                id: '3',
                title: 'Software Engineering Past Paper 2023',
                category: 'PAST_PAPERS',
                university: 'University of Colombo',
                faculty: 'Computer Science',
                courseCode: 'CS3010',
                semester: 6,
                fileType: 'pdf',
                downloadCount: 412,
                rating: 4.2,
                reviewCount: 24,
            },
        ]);
        setLoading(false);
    }, [filters]);

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
                    <div className="flex items-center space-x-4">
                        <Link href="/resources/upload" className="btn-primary flex items-center">
                            <FiUpload className="mr-2" /> Upload Resource
                        </Link>
                        <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
                    </div>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        University <span className="gradient-text">Resource Hub</span>
                    </h1>
                    <p className="text-gray-400">Access lecture slides, lab sheets, past papers, and more from Sri Lankan universities</p>
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
                                    <label className="block text-sm font-medium mb-2">University</label>
                                    <select
                                        value={filters.university}
                                        onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All Universities</option>
                                        <option value="University of Moratuwa">University of Moratuwa</option>
                                        <option value="SLIIT">SLIIT</option>
                                        <option value="University of Colombo">University of Colombo</option>
                                        <option value="University of Peradeniya">University of Peradeniya</option>
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
                                        <option value="LECTURE_SLIDES">Lecture Slides</option>
                                        <option value="LAB_SHEETS">Lab Sheets</option>
                                        <option value="PAST_PAPERS">Past Papers</option>
                                        <option value="NOTES">Notes</option>
                                        <option value="GITHUB_REPO">GitHub Repositories</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Semester</label>
                                    <select
                                        value={filters.semester}
                                        onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All Semesters</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                            <option key={sem} value={sem}>Semester {sem}</option>
                                        ))}
                                    </select>
                                </div>

                                <button onClick={() => setFilters({ university: '', category: '', semester: '' })} className="btn-ghost w-full text-sm">
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Resources Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading resources...</p>
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="text-center py-12 glass-card">
                                <p className="text-gray-400 text-lg">No resources found. Try different filters.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {resources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResourceCard({ resource }: { resource: any }) {
    return (
        <div className="glass-card p-6 hover-lift border border-dark-700">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="badge badge-primary">{resource.category.replace('_', ' ')}</span>
                        <span className="badge bg-purple-500/20 text-purple-300">{resource.university}</span>
                        <span className="badge bg-dark-700 text-gray-300">{resource.courseCode}</span>
                        <span className="badge bg-dark-700 text-gray-300">Semester {resource.semester}</span>
                    </div>
                    <p className="text-sm text-gray-400">{resource.faculty}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                        <FiStar className="fill-current" />
                        <span className="font-semibold">{resource.rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">({resource.reviewCount})</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span className="flex items-center">
                        <FiDownload className="mr-1" /> {resource.downloadCount} downloads
                    </span>
                    <span className="flex items-center">
                        <FiMessageCircle className="mr-1" /> {resource.reviewCount} reviews
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button className="btn-ghost text-sm">View Details</button>
                    <button className="btn-primary text-sm flex items-center">
                        <FiDownload className="mr-2" /> Download
                    </button>
                </div>
            </div>
        </div>
    );
}
