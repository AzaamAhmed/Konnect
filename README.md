# Konnect  
**Startup Founders & University Collaboration Ecosystem**

A full-stack, production-grade web and cross-platform mobile application connecting startup founders, developers, students, and mentors across Sri Lanka. Built with Next.js, NestJS, Python FastAPI, and PostgreSQL.

---

## 🚀 Features

### Platform Core
- **Authentication**: Email/password, OAuth (Google, GitHub), JWT tokens, student verification
- **Role-Based Access**: Founder, Developer, Student, Mentor, Investor, Admin roles
- **User Profiles**: Skills, portfolio, availability, reputation scoring, geo-location
- **Startup Ideas Feed**: Post ideas, tasks, funding requests with filtering and search
- **Community Groups**: 30+ seeded groups with chat and collaboration
- **Real-Time Chat**: Private messaging, group chats, typing indicators via WebSocket
- **Smart Matching**: AI-powered talent-to-idea matching using TF-IDF and cosine similarity
- **Geo-Discovery**: Find nearby collaborators using maps (Mapbox/Google Maps)
- **University Hub**: Resource sharing (lectures, papers, notes) by university/course
- **Notifications**: Real-time notifications for messages, comments, applications
- **Bookmarks & Follows**: Save posts and follow users
- **Payments**: Stripe integration for paid tasks (sandbox mode)

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: NestJS, Prisma ORM, PostgreSQL, Redis, MinIO (S3)
- **AI Service**: Python FastAPI, scikit-learn, TF-IDF vectorization
- **Real-Time**: Socket.IO (WebSocket gateway)
- **Infrastructure**: Docker Compose for local development
- **Mobile**: React Native / Expo (planned)

---

## 📁 Project Structure

```
konnect/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/            # JWT, OAuth strategies
│   │   │   ├── users/           # User management
│   │   │   ├── posts/           # Ideas, tasks, applications
│   │   │   ├── groups/          # Community groups
│   │   │   ├── messaging/       # Chat service
│   │   │   ├── websocket/       # Socket.IO gateway
│   │   │   ├── storage/         # MinIO/S3 uploads
│   │   │   ├── prisma/          # Database service
│   │   │   └── seed/            # Database seeding
│   │   ├── prisma/schema.prisma # Database schema
│   │   └── package.json
│   │
│   ├── web/              # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/             # App Router pages
│   │   │   ├── components/      # UI components
│   │   │   ├── lib/             # API client, WebSocket
│   │   │   └── styles/
│   │   ├── tailwind.config.ts   # Brown/black theme
│   │   └── package.json
│   │
│   └── ai-service/       # Python FastAPI
│       ├── app/
│       │   └── main.py          # AI endpoints
│       └── requirements.txt
│
├── docker-compose.yml    # PostgreSQL, Redis, MinIO
├── .env.example
└── package.json          # Root monorepo config
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ & npm
- Python 3.9+
- Docker & Docker Compose

### 1. Clone  & Install

```bash
git clone https://github.com/yourusername/konnect.git
cd konnect

# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../web
npm install

# Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configurations
# - Database credentials
# - OAuth client IDs (Google, GitHub)
# - JWT secrets
# - Mapbox/Google Maps API keys
```

### 3. Start Infrastructure (Docker)

```bash
# Start PostgreSQL, Redis, MinIO
docker-compose up -d

# Check services
docker-compose ps
```

### 4. Database Setup

```bash
cd apps/backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with dummy data (100+ users, 50+ posts, 30+ groups)
npm run seed
```

### 5. Run All Services

```bash
# From root directory
npm run dev

# This runs:
# - Backend: http://localhost:3001
# - Frontend: http://localhost:3000
# - AI Service: http://localhost:8001
```

Or run individually:

```bash
# Backend
cd apps/backend && npm run start:dev

# Frontend
cd apps/web && npm run dev

# AI Service
cd apps/ai-service && uvicorn app.main:app --reload --port 8001
```

---

## 📊 Seeded Data

The database is pre-populated with:
- **100+ Users**: 30 founders, 40 students, 20 developers, 10 mentors
- **50+ Posts**: Startup ideas (AI attendance, FinTech, EdTech, etc.)
- **30+ Groups**: Startup Sri Lanka, AI Engineers SL, University communities
- **Messages, Comments, Reactions**: Sample interactions
- **University Resources**: 50+ lecture slides, papers, notes

**Test Credentials:**
- Email: `founder1@konnect.lk` / Password: `password123`
- Email: `student1@student.ac.lk` / Password: `password123`
- Email: `dev1@konnect.lk` / Password: `password123`

---

## 🎨 Design System

**Color Palette**: Premium brown/black aesthetic
- Primary: `#8B4513` (Saddle Brown)
- Accent: `#DEB887` (Burlywood), `#D4AF37` (Gold)
- Dark: `#1A1A1A`, `#2D2D2D`
- Neutrals: Warm grays, cream

**UI Features**:
- Glass-morphism cards with backdrop blur
- Smooth gradients and shadows
- Hover animations and micro-interactions
- Responsive design (mobile-first)

---

## 🔌 API Documentation

Once running, access Swagger docs at:
- **Backend API**: http://localhost:3001/api/docs
- **AI Service**: http://localhost:8001/docs

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

**Posts**
- `GET /api/posts` - List all posts (with filters)
- `GET /api/posts/:id` - Get post details
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/apply` - Apply to post
- `POST /api/posts/:id/comments` - Add comment

**AI Services**
- `POST /api/matching/talent-to-post` - Match users to posts
- `POST /api/similarity/detect-duplicates` - Find similar posts
- `POST /api/recommendations/for-user` - Get recommendations

---

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 🚢 Deployment

### Production Build

```bash
# Backend
cd apps/backend
npm run build

# Frontend
cd apps/web
npm run build
```

### Docker Production

```bash
# Build images
docker build -t konnect-backend ./apps/backend
docker build -t konnect-web ./apps/web
docker build -t konnect-ai ./apps/ai-service

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

## 📧 Contact

For questions or support, reach out to: support@konnect.lk

---

**Built with ❤️ for Sri Lanka's startup ecosystem**