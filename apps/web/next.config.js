/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ui-avatars.com', 'localhost', 'storage.konnect.lk'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*',
            },
        ];
    },
};

export default nextConfig;
