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

### 🎯 Key Pages
- **Home** (`/`) - Public registration and club selection
- **Login** (`/login`) - Club administrator login
- **Dashboard** (`/dashboard`) - Admin panel with stats and assessment list
- **Checkout** (`/checkout`) - Payment status page

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
- RESTful API structure
- Express session management for authentication
- Stripe payment processing
- Database abstraction layer with Drizzle ORM

**Database (PostgreSQL)**
- `clubs` - Club info, logo, pricing, credentials
- `assessments` - Player registration and payment data
- Session store via connect-pg-simple

## Technical Decisions

1. **Stripe Payments** - Direct integration for payment processing
2. **Session-based Auth** - Server-side sessions for security
3. **Assessments Table** - Renamed from "players" to reflect assessment registration flow
4. **Price per Club** - Each club can set different assessment fees
5. **Centralized Header** - Consistent club selection across the app

## User Preferences

- Simple, everyday Arabic language
- Professional, modern design with club branding
- Fast, efficient implementation focus
- Clean code structure

## Next Steps for Production

1. Add club management API for creating/updating clubs
2. Implement email notifications for payment confirmation
3. Add assessment scheduling and location management
4. Set up Stripe webhook handlers for payment events
5. Create export functionality for admin reports
6. Add multi-language support
7. Implement SSL certificates for production

## Database Notes

- Current schema uses assessments table for player registration data
- Payment status tracks Stripe checkout sessions
- Assessment price stored per registration for audit trail
