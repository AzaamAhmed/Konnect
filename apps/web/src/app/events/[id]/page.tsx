'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { FiCalendar, FiMapPin, FiClock, FiShare2, FiUsers, FiVideo } from 'react-icons/fi';

export default function EventDetailPage() {
    const params = useParams();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchEvent(params.id as string);
    }, [params.id]);

    const fetchEvent = async (id: string) => {
        try {
            const response = await eventsAPI.getById(id);
            setEvent(response.data);
        } catch (error) {
            console.error('Failed to fetch event:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !event) return <div className="min-h-screen bg-dark-900" />;

    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    return (
        <div className="min-h-screen">
            <header className="glass-card border-b border-dark-700 sticky top-0 z-50">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/events" className="btn-ghost">← Back to Events</Link>
                    <div className="flex items-center space-x-4">
                        <button className="btn-ghost" title="Share">
                            <FiShare2 />
                        </button>
                        <button className="btn-primary">Register Now</button>
                    </div>
                </nav>
            </header>

            <div className="relative h-64 md:h-96 w-full overflow-hidden">
                {event.coverImage ? (
                    <img src={event.coverImage} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-dark-800 to-dark-700 flex items-center justify-center">
                        <FiCalendar className="text-6xl text-dark-600" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-6 -mt-32 relative z-10 pb-20">
                <div className="glass-card p-8 mb-8 backdrop-blur-xl">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="badge badge-primary">{event.category || 'Event'}</span>
                                {event.isOnline && <span className="badge bg-green-500/20 text-green-300">Online</span>}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{event.title}</h1>
                            <div className="flex flex-col md:flex-row gap-6 text-gray-300 mb-6">
                                <div className="flex items-center">
                                    <FiCalendar className="text-primary-400 mr-2" />
                                    <span>{startDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="text-primary-400 mr-2" />
                                    <span>
                                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {endDate && ` - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <FiMapPin className="text-primary-400 mr-2" />
                                    <span>{event.isOnline ? 'Virtual Event' : event.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-700 w-full md:w-auto min-w-[300px]">
                            <div className="flex items-center space-x-3 mb-6">
                                <img
                                    src={event.organizer?.avatar || `https://ui-avatars.com/api/?name=${event.organizer?.name}`}
                                    className="w-12 h-12 rounded-full border-2 border-primary-500"
                                    alt="Host"
                                />
                                <div>
                                    <p className="text-sm text-gray-400">Hosted by</p>
                                    <p className="font-bold">{event.organizer?.name}</p>
                                </div>
                            </div>

                            {event.isOnline && event.meetingLink && (
                                <a href={event.meetingLink} target="_blank" className="btn-secondary w-full flex items-center justify-center mb-3">
                                    <FiVideo className="mr-2" /> Join Meeting
                                </a>
                            )}

                            <button className="btn-primary w-full text-lg py-3">Register to Attend</button>

                            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                                <FiUsers className="mr-2" /> {event.attendeeCount || 0} people going
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">About Event</h2>
                            <div className="prose prose-invert max-w-none text-gray-300">
                                <p>{event.description}</p>
                            </div>
                        </section>
                    </div>

                    <div>
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4">Venue & Location</h3>
                            <div className="bg-dark-800 h-48 rounded-lg flex items-center justify-center border border-dark-700 mb-4">
                                <span className="text-gray-600">Map Preview</span>
                            </div>
                            <p className="text-gray-300">{event.venue || event.location}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
