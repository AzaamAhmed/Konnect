import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Sri Lankan locations
const locations = [
    { city: 'Colombo', lat: 6.9271, lng: 79.8612 },
    { city: 'Kandy', lat: 7.2906, lng: 80.6337 },
    { city: 'Galle', lat: 6.0535, lng: 80.2210 },
    { city: 'Moratuwa', lat: 6.7730, lng: 79.8814 },
    { city: 'Jaffna', lat: 9.6615, lng: 80.0255 },
    { city: 'Negombo', lat: 7.2008, lng: 79.8736 },
    { city: 'Kurunegala', lat: 7.4867, lng: 80.3654 },
];

const universities = ['University of Moratuwa', 'SLIIT', 'University of Colombo', 'University of Peradeniya', 'University of Ruhuna'];
const faculties = ['Computer Science', 'Engineering', 'Business', 'IT'];
const skills = ['React', 'Node.js', 'Python', 'Java', 'UI/UX Design', 'Marketing', 'Data Science', 'Mobile Development', 'DevOps', 'AI/ML'];

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.event.deleteMany();
    await prisma.application.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.reaction.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create 100+ users
    const users = [];
    const password = await bcrypt.hash('password123', 10);

    // 30 Founders
    for (let i = 1; i <= 30; i++) {
        const location = locations[i % locations.length];
        users.push(
            await prisma.user.create({
                data: {
                    email: `founder${i}@konnect.lk`,
                    passwordHash: password,
                    name: `Founder ${i}`,
                    username: `founder${i}`,
                    avatar: `https://ui-avatars.com/api/?name=Founder+${i}&background=8B4513&color=fff`,
                    bio: `Aspiring entrepreneur looking to build the next big startup in Sri Lanka`,
                    role: 'FOUNDER',
                    skills: skills.slice(0, 3),
                    location: location.city,
                    city: location.city,
                    latitude: location.lat,
                    longitude: location.lng,
                    reputationScore: Math.floor(Math.random() * 500) + 100,
                    trustScore: Math.random() * 5,
                    emailVerified: true,
                },
            })
        );
    }

    // 40 Students
    for (let i = 1; i <= 40; i++) {
        const location = locations[i % locations.length];
        const university = universities[i % universities.length];
        users.push(
            await prisma.user.create({
                data: {
                    email: `student${i}@student.ac.lk`,
                    passwordHash: password,
                    name: `Student ${i}`,
                    username: `student${i}`,
                    avatar: `https://ui-avatars.com/api/?name=Student+${i}&background=2D2D2D&color=fff`,
                    bio: `${university} student passionate about technology and innovation`,
                    role: 'STUDENT',
                    skills: skills.slice(i % 5, (i % 5) + 4),
                    university,
                    faculty: faculties[i % faculties.length],
                    studentId: `STU${1000 + i}`,
                    studentIdVerified: i % 3 === 0,
                    graduationYear: 2025 + (i % 3),
                    location: location.city,
                    city: location.city,
                    latitude: location.lat,
                    longitude: location.lng,
                    reputationScore: Math.floor(Math.random() * 300),
                    trustScore: Math.random() * 5,
                    emailVerified: true,
                },
            })
        );
    }

    // 20 Developers/Engineers
    for (let i = 1; i <= 20; i++) {
        const location = locations[i % locations.length];
        users.push(
            await prisma.user.create({
                data: {
                    email: `dev${i}@konnect.lk`,
                    passwordHash: password,
                    name: `Developer ${i}`,
                    username: `dev${i}`,
                    avatar: `https://ui-avatars.com/api/?name=Dev+${i}&background=A0522D&color=fff`,
                    bio: `Professional software engineer with ${i} years of experience`,
                    role: 'DEVELOPER',
                    skills: skills.slice(0, 5),
                    location: location.city,
                    city: location.city,
                    latitude: location.lat,
                    longitude: location.lng,
                    githubUrl: `https://github.com/dev${i}`,
                    portfolioUrl: `https://dev${i}.portfolio.com`,
                    availableForWork: i % 2 === 0,
                    reputationScore: Math.floor(Math.random() * 1000) + 500,
                    trustScore: 4 + Math.random(),
                    emailVerified: true,
                },
            })
        );
    }

    // 10 Mentors
    for (let i = 1; i <= 10; i++) {
        const location = locations[i % locations.length];
        users.push(
            await prisma.user.create({
                data: {
                    email: `mentor${i}@konnect.lk`,
                    passwordHash: password,
                    name: `Mentor ${i}`,
                    username: `mentor${i}`,
                    avatar: `https://ui-avatars.com/api/?name=Mentor+${i}&background=D2691E&color=fff`,
                    bio: `Industry expert with 10+ years helping startups succeed`,
                    role: 'MENTOR',
                    skills: skills,
                    location: location.city,
                    city: location.city,
                    latitude: location.lat,
                    longitude: location.lng,
                    linkedinUrl: `https://linkedin.com/in/mentor${i}`,
                    reputationScore: Math.floor(Math.random() * 2000) + 1000,
                    trustScore: 4.5 + Math.random() * 0.5,
                    emailVerified: true,
                },
            })
        );
    }

    console.log(`✅ Created ${users.length} users`);

    // Create 50+ startup posts
    const postTitles = [
        'AI-powered attendance system for Sri Lankan universities',
        'FinTech micro-loan app for SMEs in Sri Lanka',
        'Delivery aggregator for local restaurants in Colombo',
        'Smart farming IoT solution for rice cultivation',
        'EdTech platform for O/L and A/L exam prep',
        'Healthcare appointment booking app',
        'E-commerce platform for Sri Lankan handicrafts',
        'Real-time bus tracking system for Colombo',
        'Job matching platform for fresh graduates',
        'Digital payment wallet for rural communities',
        'Online marketplace for organic products',
        'AI-powered legal documentation assistant',
        'Property management SaaS for Sri Lanka',
        'Freelance marketplace for local talent',
        'Mental health support chatbot',
        'Carbon footprint tracker for businesses',
        'Event management platform',
        'Language learning app with Sinhala/Tamil',
        'Blockchain-based supply chain solution',
        'Tourism guide app for Sri Lanka',
    ];

    const posts = [];
    for (let i = 0; i < 50; i++) {
        const author = users[i % 30]; // Use founders as authors
        const location = locations[i % locations.length];
        const title = postTitles[i % postTitles.length] + ` v${Math.floor(i / postTitles.length) + 1}`;

        posts.push(
            await prisma.post.create({
                data: {
                    authorId: author.id,
                    title,
                    description: `Looking for talented individuals to join our mission to revolutionize ${title.toLowerCase()}. We're building an innovative solution to address real problems in the Sri Lankan market.`,
                    type: i % 3 === 0 ? 'TASK' : 'IDEA',
                    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'].slice(0, (i % 3) + 2),
                    fundingStage: ['IDEA', 'PROTOTYPE', 'MVP', 'EARLY'][i % 4],
                    lookingFor: ['Developer', 'Designer', 'Marketer'].slice(0, (i % 2) + 1),
                    tags: ['startup', 'tech', 'srilanka'],
                    category: ['Technology', 'FinTech', 'EdTech', 'HealthTech'][i % 4],
                    location: location.city,
                    city: location.city,
                    latitude: location.lat,
                    longitude: location.lng,
                    isPaid: i % 4 === 0,
                    compensation: i % 4 === 0 ? (i + 1) * 10000 : null,
                    viewCount: Math.floor(Math.random() * 1000),
                    isActive: true,
                    isFeatured: i % 10 === 0,
                },
            })
        );
    }

    console.log(`✅ Created ${posts.length} posts`);

    // Create 30+ community groups
    const groupNames = [
        'Startup Sri Lanka',
        'AI Engineers SL',
        'University of Moratuwa CS',
        'SLIIT Tech Hub',
        'FinTech Innovators',
        'React Developers Sri Lanka',
        'Python Sri Lanka',
        'Design Community SL',
        'Digital Marketers LK',
        'Blockchain Sri Lanka',
    ];

    const groups = [];
    for (let i = 0; i < 30; i++) {
        const name = groupNames[i % groupNames.length] + (i >= groupNames.length ? ` ${Math.floor(i / groupNames.length) + 1}` : '');
        const group = await prisma.group.create({
            data: {
                name,
                description: `Community for ${name} - Connect, collaborate, and grow together`,
                category: ['Technology', 'Startup', 'Education'][i % 3],
                university: i % 3 === 2 ? universities[i % universities.length] : null,
                memberCount: Math.floor(Math.random() * 500) + 50,
            },
        });
        groups.push(group);

        // Add members to groups
        for (let j = 0; j < Math.min(20, users.length); j++) {
            await prisma.groupMember.create({
                data: {
                    userId: users[(i * 5 + j) % users.length].id,
                    groupId: group.id,
                    role: j === 0 ? 'admin' : 'member',
                },
            });
        }
    }

    console.log(`✅ Created ${groups.length} groups with members`);

    // Create sample messages (30+ conversations)
    for (let i = 0; i < 30; i++) {
        const sender = users[i % users.length];
        const group = groups[i % groups.length];

        for (let j = 0; j < 5; j++) {
            await prisma.message.create({
                data: {
                    senderId: sender.id,
                    groupId: group.id,
                    content: `This is message ${j + 1} in group ${group.name}`,
                    isGroupMessage: true,
                },
            });
        }
    }

    console.log('✅ Created sample messages');

    // Create comments and reactions
    for (const post of posts.slice(0, 20)) {
        for (let i = 0; i < 5; i++) {
            const user = users[i % users.length];
            await prisma.comment.create({
                data: {
                    authorId: user.id,
                    postId: post.id,
                    content: `Great idea! I'd love to collaborate on this project.`,
                },
            });

            await prisma.reaction.create({
                data: {
                    userId: user.id,
                    postId: post.id,
                    type: ['like', 'upvote'][i % 2],
                },
            });
        }
    }

    console.log('✅ Created comments and reactions');

    // Create follows and bookmarks
    for (let i = 0; i < 50; i++) {
        const follower = users[i % users.length];
        const following = users[(i + 10) % users.length];

        if (follower.id !== following.id) {
            await prisma.follow.create({
                data: {
                    followerId: follower.id,
                    followingId: following.id,
                },
            });
        }

        await prisma.bookmark.create({
            data: {
                userId: follower.id,
                postId: posts[i % posts.length].id,
            },
        });
    }

    console.log('✅ Created follows and bookmarks');

    // Create university resources
    const resourceCategories = ['LECTURE_SLIDES', 'LAB_SHEETS', 'PAST_PAPERS', 'NOTES'];
    for (let i = 0; i < 50; i++) {
        const student = users.find((u) => u.role === 'STUDENT') || users[0];
        await prisma.resource.create({
            data: {
                uploaderId: student.id,
                title: `${resourceCategories[i % 4].replace('_', ' ')} - CS${2000 + i}`,
                description: `Resource for Computer Science course`,
                category: resourceCategories[i % 4],
                university: universities[i % universities.length],
                faculty: 'Computer Science',
                courseCode: `CS${2000 + i}`,
                semester: (i % 8) + 1,
                subject: `Subject ${i + 1}`,
                fileUrl: `https://storage.konnect.lk/resources/file${i}.pdf`,
                fileType: 'pdf',
                fileSize: Math.floor(Math.random() * 5000000),
                downloadCount: Math.floor(Math.random() * 500),
                rating: 3 + Math.random() * 2,
                reviewCount: Math.floor(Math.random() * 50),
                isApproved: true,
            },
        });
    }

    console.log('✅ Created university resources');

    console.log('');
    console.log('🎉 Seeding complete!');
    console.log(`📊 Database seeded with:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${posts.length} posts`);
    console.log(`   - ${groups.length} groups`);
    console.log(`   - 150+ messages`);
    console.log(`   - 100+ comments`);
    console.log(`   - 100+ reactions`);
    console.log(`   - 50 resources`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
