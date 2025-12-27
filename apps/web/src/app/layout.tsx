import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

export const metadata: Metadata = {
    title: {
        template: '%s | Konnect',
        default: 'Konnect - Startup Founders & University Collaboration Ecosystem',
    },
    description: 'Connect with founders, developers, students, and mentors. Build the next big thing in Sri Lanka.',
    keywords: ['startup', 'collaboration', 'university', 'sri lanka', 'founders', 'developers'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://konnect.lk',
        title: 'Konnect - Build the Future',
        description: 'The number one startup ecosystem for Sri Lankan universities and founders.',
        siteName: 'Konnect',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Konnect Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Konnect',
        description: 'Startup ecosystem for Sri Lanka',
        images: ['/images/og-image.jpg'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    )
}
