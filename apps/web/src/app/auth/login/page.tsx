'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            localStorage.setItem('token', response.data.accessToken);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = (provider: string) => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-warm rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">K</span>
                        </div>
                        <span className="text-3xl font-display font-bold gradient-text">Konnect</span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-display font-bold">Welcome back</h1>
                    <p className="mt-2 text-gray-400">Sign in to continue to Konnect</p>
                </div>

                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => handleOAuth('google')}
                        className="w-full flex items-center justify-center space-x-3 glass-card p-4 hover-lift border border-dark-600"
                    >
                        <FcGoogle className="text-2xl" />
                        <span>Continue with Google</span>
                    </button>
                    <button
                        onClick={() => handleOAuth('github')}
                        className="w-full flex items-center justify-center space-x-3 glass-card p-4 hover-lift border border-dark-600"
                    >
                        <FaGithub className="text-2xl" />
                        <span>Continue with GitHub</span>
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-dark-800 text-gray-400">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field pl-12"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field pl-12"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2 rounded" />
                            <span className="text-gray-400">Remember me</span>
                        </label>
                        <Link href="/auth/forgot-password" className="text-primary-400 hover:text-primary-300">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        <FiArrowRight className="ml-2" />
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 font-medium">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
