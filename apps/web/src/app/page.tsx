import Link from 'next/link'
import { FiArrowRight, FiUsers, FiTrendingUp, FiZap, FiGlobe } from 'react-icons/fi'

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-dark-700">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-warm rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold text-white">K</span>
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text">Konnect</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/ideas" className="btn-ghost">Ideas</Link>
                        <Link href="/discover" className="btn-ghost">Discover</Link>
                        <Link href="/resources" className="btn-ghost">Resources</Link>
                        <Link href="/groups" className="btn-ghost">Groups</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/auth/login" className="btn-ghost">Login</Link>
                        <Link href="/auth/register" className="btn-primary">Get Started</Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="container mx-auto text-center max-w-5xl">
                    <div className="inline-block mb-6">
                        <span className="badge badge-primary text-sm">🚀 Powering Sri Lanka's Startup Ecosystem</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
                        Where <span className="gradient-text">Founders</span> Meet{' '}
                        <span className="gradient-text">Talent</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
                        Connect with startup founders, developers, students, and mentors across Sri Lanka.
                        Collaborate on ideas, find opportunities, and build the next big thing together.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                            Join Konnect <FiArrowRight className="ml-2" />
                        </Link>
                        <Link href="/ideas" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                            Explore Ideas
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="glass-card p-6 hover-lift">
                            <div className="text-3xl font-bold gradient-text mb-1">100+</div>
                            <div className="text-gray-400 text-sm">Active Users</div>
                        </div>
                        <div className="glass-card p-6 hover-lift">
                            <div className="text-3xl font-bold gradient-text mb-1">50+</div>
                            <div className="text-gray-400 text-sm">Startup Ideas</div>
                        </div>
                        <div className="glass-card p-6 hover-lift">
                            <div className="text-3xl font-bold gradient-text mb-1">30+</div>
                            <div className="text-gray-400 text-sm">Communities</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-4xl font-display font-bold text-center mb-16">
                        Everything You Need to <span className="gradient-text">Succeed</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Feature
                            icon={<FiUsers />}
                            title="Find Collaborators"
                            description="Connect with developers, designers, and entrepreneurs who share your vision"
                        />
                        <Feature
                            icon={<FiTrendingUp />}
                            title="AI Matching"
                            description="Smart recommendations to find the perfect team members and opportunities"
                        />
                        <Feature
                            icon={<FiZap />}
                            title="Real-time Chat"
                            description="Instant messaging, group discussions, and collaborative workspaces"
                        />
                        <Feature
                            icon={<FiGlobe />}
                            title="Geo Discovery"
                            description="Find nearby collaborators, startups, and events across Sri Lanka"
                        />
                    </div>
                </div>
            </section>

            {/* University Hub */}
            <section className="py-20 px-6 bg-dark-900/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="glass-card p-12 text-center">
                        <h2 className="text-4xl font-display font-bold mb-4">
                            University Student <span className="gradient-text">Resource Hub</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                            Access lecture slides, lab sheets, past papers, and notes from Sri Lankan universities.
                            Share knowledge and help each other succeed.
                        </p>
                        <Link href="/resources" className="btn-primary inline-flex items-center">
                            Browse Resources <FiArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-5xl font-display font-bold mb-6">
                        Ready to Build Something <span className="gradient-text">Amazing</span>?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join thousands of founders, developers, and students building the future of Sri Lanka
                    </p>
                    <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center glow">
                        Start Your Journey <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-dark-700 py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-warm rounded-lg" />
                                <span className="text-xl font-display font-bold">Konnect</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Empowering Sri Lanka's startup ecosystem
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Platform</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div><Link href="/ideas">Ideas</Link></div>
                                <div><Link href="/discover">Discover</Link></div>
                                <div><Link href="/resources">Resources</Link></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Community</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div><Link href="/groups">Groups</Link></div>
                                <div><Link href="/events">Events</Link></div>
                                <div><Link href="/about">About</Link></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div><Link href="/privacy">Privacy</Link></div>
                                <div><Link href="/terms">Terms</Link></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 text-sm border-t border-dark-700 pt-8">
                        © 2025 Konnect. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="glass-card p-6 hover-lift group">
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4 text-primary-400 text-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    )
}
