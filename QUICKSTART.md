# Konnect - Quick Start Guide

Get the Konnect platform running in 5 minutes!

## Prerequisites

- **Node.js 18+** and npm
- **Python 3.9+**
- **Docker & Docker Compose**
- **Git**

---

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/konnect.git
cd konnect
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd apps/backend
npm install
cd ../..

# Frontend dependencies
cd apps/web
npm install
cd ../..

# AI service dependencies
cd apps/ai-service
pip install -r requirements.txt
cd ../..
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values (optional for local dev)
# Default values work for local development
```

### 4. Start Infrastructure (Docker)

```bash
# Start PostgreSQL, Redis, MinIO
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 5. Database Setup

```bash
cd apps/backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with 100+ users, 50+ posts, 30+ groups
npm run seed
```

### 6. Start All Services

**Option A: Run all services concurrently** (recommended)
```bash
# From root directory
npm run dev
```

**Option B: Run services individually**
```bash
# Terminal 1: Backend
cd apps/backend && npm run start:dev

# Terminal 2: Frontend
cd apps/web && npm run dev

# Terminal 3: AI Service
cd apps/ai-service && uvicorn app.main:app --reload --port 8001

# Terminal 4: Mobile App (New)
cd apps/mobile && npx expo start
```

---

## ✅ Access the Platform

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js web app |
| **Backend API** | http://localhost:3001 | NestJS REST API |
| **API Docs** | http://localhost:3001/api/docs | Swagger documentation |
| **AI Service** | http://localhost:8001 | FastAPI AI microservice |
| **AI Docs** | http://localhost:8001/docs | AI API documentation |
| **MinIO Console** | http://localhost:9001 | Object storage (konnect_minio / konnect_minio_password) |

---

## 🧪 Test Credentials

After seeding, you can log in with any of these accounts:

| Email | Password | Role |
|-------|----------|------|
| `founder1@konnect.lk` | `password123` | Founder |
| `student1@student.ac.lk` | `password123` | Student |
| `dev1@konnect.lk` | `password123` | Developer |
| `mentor1@konnect.lk` | `password123` | Mentor |

All seeded users use the same password: **`password123`**

---

## 📋 Verify Installation

### Backend Health Check
```bash
curl http://localhost:3001/api/auth
```

### AI Service Health Check
```bash
curl http://localhost:8001/health
```

### Database Check
```bash
cd apps/backend
npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

---

## 🎯 Key Features to Test

1. **Authentication**
   - Register a new account at `/auth/register`
   - Login with seeded credentials
   - Try OAuth login (requires configuration)

2. **Dashboard**
   - View your personalized dashboard
   - Check recommendations
   - See user stats

3. **Ideas Feed**
   - Browse startup ideas at `/ideas`
   - Filter by type, category, location
   - Apply to opportunities

4. **Real-Time Chat**
   - Send messages at `/messages`
   - WebSocket auto-connect
   - Test typing indicators

5. **Discover**
   - Find collaborators at `/discover`
   - Use geo-location for nearby users
   - Filter by role and location

6. **University Hub**
   - Browse resources at `/resources`
   - Filter by university, semester, category

7. **User Profiles**
   - View any user profile
   - Check skills, reputation, portfolio

---

## 🛑 Troubleshooting

### Docker services not starting
```bash
# Stop and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Database errors
```bash
cd apps/backend

# Reset database
npx prisma migrate reset

# Re-seed
npm run seed
```

### Port conflicts
- Backend: Change `BACKEND_PORT` in `.env`
- Frontend: Change port in `apps/web/package.json` dev script
- AI: Change port in AI service start command

### Node modules issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# For each app
cd apps/backend && rm -rf node_modules && npm install
cd ../web && rm -rf node_modules && npm install
```

---

## 🔧 Development Tips

### Watch mode
All services support hot reload in development:
- Backend: Auto-restart on file changes
- Frontend: Fast Refresh for React components
- AI Service: `--reload` flag for auto-restart

### Database management
```bash
# Prisma Studio (visual database editor)
cd apps/backend && npx prisma studio

# View schema
npx prisma db pull

# Generate migrations
npx prisma migrate dev --name your_migration_name
```

### API Testing
- Use Swagger UI at http://localhost:3001/api/docs
- Or use tools like Postman/Insomnia
- JWT token required for protected routes (get from login response)

---

## 📦 Production Build

```bash
# Backend
cd apps/backend
npm run build
npm run start:prod

# Frontend
cd apps/web
npm run build
npm run start

# AI Service
cd apps/ai-service
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

---

## 🎉 Next Steps

1. **Customize OAuth**: Add your Google/GitHub client IDs in `.env`
2. **Configure Maps**: Get Mapbox or Google Maps API key
3. **Set up Stripe**: Add Stripe keys for payments
4. **Add Email**: Configure SMTP for email verification
5. **Customize Theme**: Edit `apps/web/tailwind.config.ts`

---

## 📚 Documentation

- [Full README](../README.md)
- [Implementation Plan](file:///C:/Users/DELL/.gemini/antigravity/brain/4b65b396-4e39-4b8b-a4ea-a74e4d3a403c/implementation_plan.md)
- [Walkthrough](file:///C:/Users/DELL/.gemini/antigravity/brain/4b65b396-4e39-4b8b-a4ea-a74e4d3a403c/walkthrough.md)
- [API Documentation](http://localhost:3001/api/docs)

---

**Need help?** Check the full README or walkthrough documents for detailed information about the architecture and features.
