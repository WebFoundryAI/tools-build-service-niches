// Admin authentication configuration
// Add admin email addresses here - these users will have access to the admin area
export const ADMIN_EMAILS: string[] = [
  // Add your admin email addresses here, e.g.:
  // "admin@example.com",
  // "owner@yourdomain.co.uk",
];

// Check if an email is in the admin list
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );
}
