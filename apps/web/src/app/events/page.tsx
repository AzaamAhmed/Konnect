'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { FiCalendar, FiMapPin, FiClock, FiPlus, FiFilter } from 'react-icons/fi';

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: '', isOnline: '' });

    useEffect(() => {
        fetchEvents();
    }, [filters]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventsAPI.getAll(filters);
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
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
                    <div className="flex items-center space-x-4">
                        <Link href="/events/new" className="btn-primary flex items-center">
                            <FiPlus className="mr-2" /> Host Event
                        </Link>
                        <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
                    </div>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-display font-bold mb-4">
                        Upcoming <span className="gradient-text">Events</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Discover workshops, hackathons, and meetups in the Sri Lankan startup ecosystem.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center mb-8">
                    <div className="glass-card p-2 flex items-center space-x-4 rounded-full px-6">
                        <FiFilter className="text-primary-400" />
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="bg-transparent text-sm border-none focus:ring-0 text-gray-300"
                        >
                            <option value="">All Categories</option>
                            <option value="WORKSHOP">Workshop</option>
                            <option value="HACKATHON">Hackathon</option>
                            <option value="MEETUP">Meetup</option>
                            <option value="WEBINAR">Webinar</option>
                        </select>
                        <div className="w-px h-4 bg-dark-700"></div>
                        <select
                            value={filters.isOnline}
                            onChange={(e) => setFilters({ ...filters, isOnline: e.target.value })}
                            className="bg-transparent text-sm border-none focus:ring-0 text-gray-300"
                        >
                            <option value="">Any Location</option>
                            <option value="true">Online</option>
                            <option value="false">In Person</option>
                        </select>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="col-span-full py-20 text-center glass-card">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-bold mb-2">No events found</h3>
                            <p className="text-gray-400 mb-6">Be the first to host an event!</p>
                            <Link href="/events/new" className="btn-primary">Host Event</Link>
                        </div>
                    ) : (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function EventCard({ event }: { event: any }) {
    const startDate = new Date(event.startDate);

    return (
        <Link href={`/events/${event.id}`} className="glass-card hover-lift group border border-dark-700 overflow-hidden block">
            <div className="h-48 bg-dark-800 relative">
                {event.coverImage ? (
                    <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-700">
                        <FiCalendar className="text-4xl text-dark-600" />
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-dark-900/90 backdrop-blur px-3 py-1 rounded-lg text-center border border-dark-700">
                    <div className="text-xs text-primary-400 font-bold uppercase">{startDate.toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-white">{startDate.getDate()}</div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                    <span className="badge badge-primary">{event.category || 'General'}</span>
                    {event.isOnline && <span className="badge bg-green-500/20 text-green-300">Online</span>}
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-400 mb-6">
                    <div className="flex items-center">
                        <FiClock className="mr-2 text-primary-500" />
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center">
                        <FiMapPin className="mr-2 text-primary-500" />
                        {event.isOnline ? 'Virtual Event' : event.location || 'To be announced'}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                    <div className="flex items-center space-x-2">
                        <img
                            src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${event.organizer?.name}`}
                            className="w-6 h-6 rounded-full"
                            alt="Organizer"
                        />
                        <span className="text-xs text-gray-500 truncate max-w-[100px]">{event.organizer?.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {event.attendeeCount || 0} attending
                    </span>
                </div>
            </div>
        </Link>
    );
}
