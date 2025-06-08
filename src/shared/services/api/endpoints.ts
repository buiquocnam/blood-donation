// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',
} as const;

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
} as const;

// Event endpoints
export const EVENT_ENDPOINTS = {
  LIST: '/events',
  DETAIL: (id: string) => `/events/${id}`,
  CREATE: '/events',
  UPDATE: (id: string) => `/events/${id}`,
  DELETE: (id: string) => `/events/${id}`,
  REGISTER: (id: string) => `/events/${id}/register`,
} as const;

// Registration endpoints
export const REGISTRATION_ENDPOINTS = {
  LIST: '/registrations',
  DETAIL: (id: string) => `/registrations/${id}`,
  UPDATE_STATUS: (id: string) => `/registrations/${id}/status`,
} as const;

// Feedback endpoints
export const FEEDBACK_ENDPOINTS = {
  LIST: '/feedbacks',
  DETAIL: (id: string) => `/feedbacks/${id}`,
  CREATE: '/feedbacks',
  REPLY: (id: string) => `/feedbacks/${id}/reply`,
} as const;

// Location endpoints
export const LOCATION_ENDPOINTS = {
  CITIES: '/locations/cities',
  DISTRICTS: (cityId: string) => `/locations/cities/${cityId}/districts`,
  WARDS: (districtId: string) => `/locations/districts/${districtId}/wards`,
} as const;

// Public endpoints
export const PUBLIC_ENDPOINTS = {
  BLOOD_TYPES: {
    LIST: '/public/blood-types',
    DETAIL: (code: string) => `/public/blood-types/${code}`,
  },

} as const; 