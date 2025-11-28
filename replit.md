# Soccer Hunters - Player Assessment Platform

## Overview

Soccer Hunters is a web-based player assessment registration platform for Egyptian football clubs. The platform allows players to register for club assessment trials and make online payments, while club administrators can manage registrations and track payment status.

## Current Implementation Status

### ✅ Completed Features
1. **Frontend Architecture** - React 18 with Vite, TypeScript, RTL support
2. **Authentication System** - Club admin login with sessions and bcrypt
3. **Player Assessment Registration** - Comprehensive form with validation
4. **Payment Integration** - Stripe integration for assessment fees
5. **Club Dashboard** - Admin panel to manage registrations and view revenue
6. **Database Schema** - PostgreSQL with assessments and clubs tables
7. **Admin Routes** - API endpoints for registration, payment, and club management
8. **Professional Backend** - Service layer with error handling, validation, caching, and export functionality

### 🎯 Key Pages
- **Home** (`/`) - Public registration and club selection
- **Login** (`/login`) - Club administrator login (emerald green theme)
- **Dashboard** (`/dashboard`) - Admin panel with stats and assessment list
- **Checkout** (`/checkout`) - Payment status page
- **Admin Login** (`/admin/login`) - Master admin login (dark theme with gold accents)
- **Admin Panel** (`/admin/master`) - Professional master control panel with user management

### 💳 Payment System
- Stripe integration for handling payments
- Each club sets its own assessment fee
- Payment status tracking (pending/completed/failed)
- Automatic checkout session creation after registration

### 🏗️ Architecture

**Frontend (React + TypeScript)**
- Component-based UI with Shadcn components
- RTL layout support for Arabic
- Wouter for client-side routing
- TanStack Query for server state management
- React Hook Form for form validation

**Backend (Express + TypeScript)**
- RESTful API structure with professional error handling
- Service layer pattern (auth, assessment, payment, stats, export)
- Express session management for authentication
- Vodafone Cash payment (Stripe disabled)
- PostgreSQL database via Neon
- Request validation with Zod schemas
- Response formatting middleware for consistent API responses
- Built-in caching system for stats

**Database (PostgreSQL - Neon)**
- `clubs` - Club info, logo, pricing, credentials
- `players` - Player accounts with authentication
- `assessments` - Player registration and payment data
- `users` - Admin users

### 🔧 Backend Services

1. **AuthService** - Club login and access control
2. **AssessmentService** - Assessment registration and validation
3. **PaymentService** - Stripe checkout and payment verification
4. **StatsService** - Club and platform statistics with caching
5. **ExportService** - CSV and JSON export functionality

### 📋 API Endpoints

**Authentication**
- `POST /api/auth/login` - Club login
- `POST /api/auth/logout` - Club logout
- `GET /api/auth/me` - Current club info

**Assessments**
- `POST /api/assessments` - Create new assessment registration
- `GET /api/assessments` - List assessments (auth required)
- `GET /api/assessments/stats` - Detailed club statistics
- `GET /api/assessments/export/csv` - Export as CSV
- `GET /api/assessments/export/json` - Export as JSON
- `DELETE /api/assessments/:id` - Delete assessment record

**Statistics**
- `GET /api/stats/club` - Club dashboard stats (auth required)
- `GET /api/stats/platform` - Platform-wide stats

**Payment**
- `GET /api/checkout/status` - Verify payment status

**Clubs**
- `GET /api/clubs/:clubId` - Get public club information

**Admin (Master Control Panel)**
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check admin session
- `GET /api/admin/clubs` - List all clubs (admin only)
- `PUT /api/admin/clubs/:clubId` - Update club settings (admin only)
- `DELETE /api/admin/clubs/:clubId` - Delete club (admin only)
- `GET /api/admin/players` - List all players (admin only)
- `PUT /api/admin/players/:id` - Update player (admin only)
- `DELETE /api/admin/players/:id` - Delete player (admin only)
- `GET /api/admin/assessments` - List all assessments (admin only)
- `DELETE /api/admin/assessments/:id` - Delete assessment (admin only)

## Technical Decisions

1. **Vodafone Cash Payment** - Manual payment via 01061887799 (Stripe disabled)
2. **Session-based Auth** - Server-side sessions for security
3. **Assessments Table** - Renamed from "players" to reflect assessment registration flow
4. **Price per Club** - Each club can set different assessment fees
5. **Service Layer** - Professional separation of concerns
6. **PostgreSQL Database** - Neon-hosted PostgreSQL with Drizzle ORM
7. **Error Handling Classes** - Comprehensive error management
8. **Response Formatting Middleware** - Consistent API responses

## User Preferences

- Simple, everyday Arabic language
- Professional, modern design with club branding
- Fast, efficient implementation focus
- Clean code structure with type safety
- Best practices for error handling

## Testing

**Available Test Users:**
- Club: النادي الأهلي (Al Ahly)
- Username: `ahly`
- Password: `ahly123`
- Assessment Fee: 5000 EGP

**API Testing:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ahly","password":"ahly123"}'

# Get club info
curl http://localhost:5000/api/clubs/al-ahly
```

## Deployment Status

The application is ready for development use with in-memory storage. For production:

1. **Database Migration** - Switch from memory to Neon PostgreSQL
2. **Environment Setup** - Configure Stripe webhooks and API keys
3. **Email Notifications** - Add payment confirmation emails
4. **Assessment Scheduling** - Implement tryout date management
5. **SSL Certificates** - Install TLS for production
6. **Health Checks** - Add readiness and liveness probes

## Known Issues & TODOs

- ✅ Backend API fully functional
- ✅ Vodafone Cash payment integration complete
- ✅ Error handling and validation complete
- ✅ Admin Panel: Master control panel with user management complete
- ✅ Database: PostgreSQL via Neon (migrated from memory)
- 📝 Email: Notification system not yet implemented

## File Structure

```
server/
├── routes.ts           # All API endpoints
├── services/
│   ├── auth.service.ts
│   ├── assessment.service.ts
│   ├── payment.service.ts
│   ├── stats.service.ts
│   └── export.service.ts
├── middleware.ts       # Express middleware
├── errors.ts          # Error classes
├── validators.ts      # Zod schemas
├── storage.ts         # Storage exports (uses DbStorage)
├── storage-db.ts      # PostgreSQL storage implementation
├── storage-memory.ts  # In-memory storage (backup)
├── db.ts              # Database connection
├── cache.ts           # Caching system
└── types.ts           # TypeScript types

client/
├── src/
│   ├── pages/         # Route pages
│   ├── components/    # React components
│   └── hooks/         # Custom hooks
└── index.html         # HTML template
```

