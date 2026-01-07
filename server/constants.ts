// Application constants
export const POSITIONS = {
  GK: "gk",
  CB: "cb",
  LB: "lb",
  RB: "rb",
  CM: "cm",
  ST: "st",
} as const;

export const POSITION_NAMES = {
  gk: "حارس مرمى",
  cb: "مدافع",
  lb: "ظهير أيسر",
  rb: "ظهير أيمن",
  cm: "وسط ملعب",
  st: "مهاجم",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export const AGE_GROUPS = {
  U12: "U12",
  U15: "U15",
  U18: "U18",
  ADULT: "Adult",
} as const;

export const CACHE_TTL = {
  SHORT: 60000, // 1 minute
  MEDIUM: 300000, // 5 minutes
  LONG: 3600000, // 1 hour
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const VALIDATION = {
  NATIONAL_ID_LENGTH: 14,
  PHONE_REGEX: /^01[0125][0-9]{8}$/,
  MIN_NAME_LENGTH: 10,
  MAX_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 6,
} as const;

// Eligibility constants
export const ELIGIBILITY = {
  MIN_AGE: 8,  // Minimum age in years
  MAX_AGE: 25, // Maximum age in years
} as const;
