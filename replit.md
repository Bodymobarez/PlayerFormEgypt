# Egyptian Youth Football League Registration System

## Overview

This is a web-based player registration system for Egyptian football clubs' youth academies (الناشئين والبراعم). The application allows clubs to register young players with comprehensive personal and athletic information, and provides club administrators with a dashboard to manage their registered players. The system is built as a full-stack application with a React frontend and Express backend, supporting multiple Egyptian football clubs with Arabic language and RTL (right-to-left) layout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with Vite as the build tool and development server
- TypeScript for type safety
- Wouter for client-side routing (lightweight React Router alternative)

**UI Framework**
- Shadcn UI components with Radix UI primitives for accessible, composable components
- Tailwind CSS for styling with custom theme configuration
- Cairo font for proper Arabic typography
- RTL (right-to-left) layout support throughout the application

**State Management**
- TanStack Query (React Query) for server state management and API calls
- React Hook Form with Zod for form validation
- No global client state management (relying on server state)

**Key Design Patterns**
- Component composition using Radix UI's unstyled primitives
- Form validation using Zod schemas shared between frontend and backend
- Custom hooks for authentication (`useAuth`) and UI utilities
- Centralized API client with credential-based authentication

### Backend Architecture

**Server Framework**
- Express.js with TypeScript and ES modules
- Development mode uses Vite middleware for HMR and SSR
- Production mode serves static built assets

**Authentication & Sessions**
- Express-session for server-side session management
- BCrypt for password hashing
- Session-based authentication (no JWT tokens)
- Session cookies with HTTP-only flag for security

**API Structure**
- RESTful API endpoints under `/api` prefix
- Authentication routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Player management: `/api/players` (GET, POST), `/api/players/:id` (DELETE)
- Club management: `/api/clubs` (GET)
- Middleware for authentication requirements

**Code Organization**
- Separate development (`index-dev.ts`) and production (`index-prod.ts`) entry points
- Shared routing logic in `routes.ts`
- Storage abstraction layer in `storage.ts`
- Application setup in `app.ts`

### Data Storage

**ORM & Database**
- Drizzle ORM for type-safe database queries
- Neon serverless Postgres driver (@neondatabase/serverless)
- Schema-first approach with TypeScript types generated from Drizzle schemas

**Database Schema**
Three main tables defined in `shared/schema.ts`:

1. **users** - Generic user authentication (currently unused, likely for future expansion)
   - UUID primary key
   - Username and hashed password

2. **clubs** - Football club information and credentials
   - Club ID, name, logo URL, primary color for branding
   - Separate username/password for club admin login
   - Created timestamp

3. **players** - Youth player registration data
   - Links to club via clubId
   - Personal info: full name, birth date/place, national ID, address
   - Contact: phone numbers for player and guardian
   - Athletic info: position, height, weight, previous club
   - Medical history, school information
   - Photo URL, consent flags

**Data Access Pattern**
- Repository pattern through `IStorage` interface
- All database operations abstracted in `DbStorage` class
- Shared Zod schemas for validation between client and server

### External Dependencies

**Database Service**
- Neon Postgres (serverless PostgreSQL)
- Environment variable: `DATABASE_URL`
- Connection pooling via @neondatabase/serverless Pool

**Development Tools**
- Replit-specific Vite plugins for development banner and cartographer
- Custom Vite plugin for OpenGraph meta image URL updates

**Session Storage**
- connect-pg-simple for PostgreSQL session store (installed but configuration not visible in provided files)
- Session secret from environment variable or fallback

**UI Component Libraries**
- Radix UI suite (@radix-ui/react-*) for headless accessible components
- Lucide React for icons
- cmdk for command palette functionality
- vaul for drawer components
- react-day-picker for calendar/date selection
- recharts for potential data visualization

**Form & Validation**
- react-hook-form for form state management
- @hookform/resolvers for Zod integration
- zod and drizzle-zod for schema validation
- zod-validation-error for user-friendly error messages

**Styling**
- @tailwindcss/vite for Tailwind CSS v4
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for className utilities
- Google Fonts (Cairo) for Arabic typography