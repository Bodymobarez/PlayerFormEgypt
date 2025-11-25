// API Documentation
export const apiDocs = {
  version: "1.0.0",
  title: "Soccer Hunters API",
  description: "Professional API for player assessment registration and payment management",
  baseUrl: "/api",
  endpoints: {
    auth: {
      login: {
        method: "POST",
        path: "/auth/login",
        description: "Club administrator login",
        body: {
          username: "string",
          password: "string",
        },
        response: {
          success: true,
          data: {
            club: {
              id: "number",
              clubId: "string",
              name: "string",
              logoUrl: "string",
              primaryColor: "string",
            },
          },
        },
        example: {
          request: {
            username: "ahly",
            password: "ahly123",
          },
          response: {
            success: true,
            data: {
              club: {
                id: 1,
                clubId: "al-ahly",
                name: "النادي الأهلي",
                logoUrl: "/logos/al_ahly.png",
                primaryColor: "hsl(354 70% 45%)",
              },
            },
            timestamp: "2025-11-25T20:50:21.785Z",
          },
        },
      },
      logout: {
        method: "POST",
        path: "/auth/logout",
        description: "Club administrator logout",
        requiresAuth: true,
      },
      me: {
        method: "GET",
        path: "/auth/me",
        description: "Get current logged-in club info",
        requiresAuth: true,
      },
    },
    assessments: {
      create: {
        method: "POST",
        path: "/assessments",
        description: "Create new player assessment registration",
        body: {
          clubId: "string",
          fullName: "string",
          birthDate: "string (YYYY-MM-DD)",
          birthPlace: "string",
          nationalId: "string (14 digits)",
          address: "string",
          phone: "string (Egyptian format)",
          guardianPhone: "string",
          guardianName: "string",
          school: "string (optional)",
          position: "string (gk/cb/lb/rb/cm/st)",
          height: "string (optional)",
          weight: "string (optional)",
          previousClub: "string (optional)",
          medicalHistory: "string (optional)",
          assessmentPrice: "number",
        },
      },
      list: {
        method: "GET",
        path: "/assessments",
        description: "Get all assessments for logged-in club",
        requiresAuth: true,
      },
      stats: {
        method: "GET",
        path: "/assessments/stats",
        description: "Get detailed statistics for club assessments",
        requiresAuth: true,
      },
      exportCsv: {
        method: "GET",
        path: "/assessments/export/csv",
        description: "Export assessments as CSV file",
        requiresAuth: true,
      },
      exportJson: {
        method: "GET",
        path: "/assessments/export/json",
        description: "Export assessments as JSON file",
        requiresAuth: true,
      },
      delete: {
        method: "DELETE",
        path: "/assessments/:id",
        description: "Delete an assessment record",
        requiresAuth: true,
      },
    },
    stats: {
      club: {
        method: "GET",
        path: "/stats/club",
        description: "Get comprehensive club statistics",
        requiresAuth: true,
      },
      platform: {
        method: "GET",
        path: "/stats/platform",
        description: "Get platform-wide statistics",
      },
    },
    checkout: {
      status: {
        method: "GET",
        path: "/checkout/status?session_id=SESSION_ID",
        description: "Check payment status for a checkout session",
      },
    },
    clubs: {
      info: {
        method: "GET",
        path: "/clubs/:clubId",
        description: "Get public club information",
      },
    },
  },
  errorCodes: {
    VALIDATION_ERROR: { code: 400, message: "Request validation failed" },
    AUTHENTICATION_ERROR: { code: 401, message: "Authentication required" },
    AUTHORIZATION_ERROR: { code: 403, message: "Access denied" },
    NOT_FOUND: { code: 404, message: "Resource not found" },
    CONFLICT: { code: 409, message: "Resource conflict" },
    PAYMENT_ERROR: { code: 402, message: "Payment processing failed" },
    STRIPE_ERROR: { code: 500, message: "Stripe API error" },
    DATABASE_ERROR: { code: 500, message: "Database operation failed" },
    INTERNAL_ERROR: { code: 500, message: "Internal server error" },
  },
};
