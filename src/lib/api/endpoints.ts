// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
};

// Donor endpoints
export const DONOR_ENDPOINTS = {
  DONATION_HISTORY: '/donors/donation-history',
  REGISTER_DONATION: '/donors/register',
  CANCEL_DONATION: (id: string) => `/donors/register/${id}/cancel`,
};

// Event endpoints
export const EVENT_ENDPOINTS = {
  LIST: '/events',
  DETAIL: (id: string) => `/events/${id}`,
  REGISTER: (id: string) => `/events/${id}/register`,
};

// Medical Staff endpoints
export const MEDICAL_STAFF_ENDPOINTS = {
  DONATION_REQUESTS: '/medical-staff/donation-requests',
  APPROVE_REQUEST: (id: string) => `/medical-staff/donation-requests/${id}/approve`,
  REJECT_REQUEST: (id: string) => `/medical-staff/donation-requests/${id}/reject`,
  UPDATE_DONATION_STATUS: (id: string) => `/medical-staff/donations/${id}/status`,
  FEEDBACKS: '/medical-staff/feedbacks',
  REPLY_FEEDBACK: (id: string) => `/medical-staff/feedbacks/${id}/reply`,
};

// Doctor endpoints
export const DOCTOR_ENDPOINTS = {
  DONORS: '/doctors/donors',
  DONOR_DETAIL: (id: string) => `/doctors/donors/${id}`,
  UPDATE_DONOR_RECORD: (id: string) => `/doctors/donors/${id}/record`,
  INELIGIBLE_DONORS: '/doctors/ineligible-donors',
  COMPLETED_DONATIONS: '/doctors/completed-donations',
};

// Volunteer Center endpoints
export const VOLUNTEER_CENTER_ENDPOINTS = {
  NOTIFICATIONS: '/volunteer-centers/notifications',
  REGISTER_CENTER: '/volunteer-centers/register',
  REGISTER_EVENT: '/volunteer-centers/events/register',
  CANCEL_EVENT: (id: string) => `/volunteer-centers/events/${id}/cancel`,
  HISTORY: '/volunteer-centers/history',
};

// Blood Bank endpoints
export const BLOOD_BANK_ENDPOINTS = {
  SEND_NOTIFICATION: '/blood-banks/notifications',
  UPDATE_NOTIFICATION: (id: string) => `/blood-banks/notifications/${id}`,
  APPROVE_EVENT: (id: string) => `/blood-banks/events/${id}/approve`,
  REJECT_EVENT: (id: string) => `/blood-banks/events/${id}/reject`,
  CREATE_EVENT: '/blood-banks/events',
  UPDATE_EVENT: (id: string) => `/blood-banks/events/${id}`,
  UPDATE_CENTER: (id: string) => `/blood-banks/centers/${id}`,
  EXPORT_REPORT: '/blood-banks/reports/export',
  BLOOD_STATISTICS: '/blood-banks/statistics',
};

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  UPDATE_USER: (id: string) => `/admin/users/${id}`,
  DELETE_USER: (id: string) => `/admin/users/${id}`,
};

export default {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  DONOR: DONOR_ENDPOINTS,
  EVENT: EVENT_ENDPOINTS,
  MEDICAL_STAFF: MEDICAL_STAFF_ENDPOINTS,
  DOCTOR: DOCTOR_ENDPOINTS,
  VOLUNTEER_CENTER: VOLUNTEER_CENTER_ENDPOINTS,
  BLOOD_BANK: BLOOD_BANK_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
}; 