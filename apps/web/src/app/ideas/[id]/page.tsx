'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { postsAPI } from '@/lib/api';
import { FiMapPin, FiDollarSign, FiUsers, FiHeart, FiMessageCircle, FiBookmark, FiSend } from 'react-icons/fi';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [application, setApplication] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchPost(params.id as string);
        }
    }, [params.id]);

    const fetchPost = async (id: string) => {
        try {
            const response = await postsAPI.getById(id);
            setPost(response.data);
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        try {
            await postsAPI.addComment(params.id as string, comment);
            setComment('');
            fetchPost(params.id as string); // Refresh
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleApply = async () => {
        if (!application.trim()) return;

        try {
            await postsAPI.apply(params.id as string, application);
            setShowApplyModal(false);
            setApplication('');
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Failed to apply:', error);
        }
    };

    const handleReaction = async () => {
        try {
            await postsAPI.addReaction(params.id as string, 'like');
            fetchPost(params.id as string);
        } catch (error) {
            console.error('Failed to react:', error);
        }
    };

    const handleBookmark = async () => {
        try {
            await postsAPI.bookmark(params.id as string);
            alert('Bookmarked!');
        } catch (error) {
            console.error('Failed to bookmark:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Post not found</h2>
                    <Link href="/ideas" className="btn-primary">Back to Ideas</Link>
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
                    <Link href="/ideas" className="btn-ghost">← Back to Ideas</Link>
                </nav>
            </header>

            <div className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Post Header */}
                <div className="glass-card p-8 mb-6">
                    <div className="flex items-start space-x-4 mb-6">
                        <img
                            src={post.author?.avatar}
                            alt={post.author?.name}
                            className="w-16 h-16 rounded-full border-2 border-primary-500"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-display font-bold mb-2">{post.title}</h1>
                            <Link href={`/profile/${post.author?.id}`} className="text-gray-400 hover:text-primary-400">
                                {post.author?.name} • {post.author?.role}
                            </Link>
                        </div>
                        {post.isPaid && (
                            <div className="text-right">
                                <div className="badge bg-green-500/20 text-green-300 border-green-500/30 mb-2">
                                    <FiDollarSign className="mr-1" /> Paid Opportunity
                                </div>
                                {post.compensation && (
                                    <div className="text-xl font-bold text-green-400">
                                        LKR {post.compensation?.toLocaleString()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <p className="text-gray-300 text-lg mb-6">{post.description}</p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                        {post.city && (
                            <span className="flex items-center">
                                <FiMapPin className="mr-1" /> {post.city}
                            </span>
                        )}
                        {post.type && <span className="badge badge-primary">{post.type}</span>}
                        {post.category && <span className="badge badge-primary">{post.category}</span>}
                        {post.fundingStage && <span className="badge bg-purple-500/20 text-purple-300">{post.fundingStage}</span>}
                    </div>

                    {/* Tech Stack */}
                    {post.techStack?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.techStack.map((tech: string, idx: number) => (
                                    <span key={idx} className="badge bg-dark-700 text-gray-300">{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Looking For */}
                    {post.lookingFor?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 flex items-center">
                                <FiUsers className="mr-2" /> Looking For
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {post.lookingFor.map((role: string, idx: number) => (
                                    <span key={idx} className="badge badge-success">{role}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-4 pt-6 border-t border-dark-700">
                        <button onClick={handleReaction} className="btn-ghost flex items-center">
                            <FiHeart className="mr-2" /> Like ({post.reactions?.length || 0})
                        </button>
                        <button onClick={handleBookmark} className="btn-ghost flex items-center">
                            <FiBookmark className="mr-2" /> Bookmark
                        </button>
                        <button onClick={() => setShowApplyModal(true)} className="btn-primary ml-auto">
                            Apply Now
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="glass-card p-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <FiMessageCircle className="mr-2" /> Comments ({post.comments?.length || 0})
                    </h2>

                    {/* Add Comment */}
                    <div className="mb-6">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="input-field min-h-[100px] resize-none"
                        />
                        <button onClick={handleAddComment} className="btn-primary mt-2">
                            <FiSend className="mr-2" /> Post Comment
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {post.comments?.map((comment: any) => (
                            <div key={comment.id} className="bg-dark-800/50 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={comment.author?.avatar}
                                        alt={comment.author?.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">{comment.author?.name}</div>
                                        <p className="text-gray-300 mt-1">{comment.content}</p>
                                        <div className="text-sm text-gray-500 mt-2">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
                    <div className="glass-card p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">Apply to this Opportunity</h2>
                        <p className="text-gray-400 mb-6">Tell {post.author?.name} why you'd be a great fit</p>
                        <textarea
                            value={application}
                            onChange={(e) => setApplication(e.target.value)}
                            placeholder="Write your application message..."
                            className="input-field min-h-[150px] resize-none mb-4"
                        />
                        <div className="flex space-x-4">
                            <button onClick={handleApply} className="btn-primary flex-1">Submit Application</button>
                            <button onClick={() => setShowApplyModal(false)} className="btn-secondary flex-1">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
