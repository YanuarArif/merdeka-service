export const PAYMENT_URLS = {
  // The base URL of your application
  BASE_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // URLs to configure in Midtrans dashboard
  MIDTRANS_SETTINGS: {
    // For handling payment status updates (configure in Midtrans dashboard)
    NOTIFICATION_URL: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/notification`,

    // Redirect URLs (will be handled automatically by our Midtrans Snap configuration)
    SUCCESS_REDIRECT: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/success`,
    ERROR_REDIRECT: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/error`,
    UNFINISH_REDIRECT: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/unfinish`,
  },
};

/**
 * Midtrans Dashboard Configuration Guide
 *
 * 1. Payment Notification URL:
 *    - Set to: {your-domain}/api/payment/notification
 *    - Example: https://your-domain.com/api/payment/notification
 *    - Handles asynchronous payment status updates
 *
 * 2. Finish, Unfinish, and Error Redirect URLs:
 *    - These are handled automatically by our Snap configuration
 *    - No need to set them manually in the dashboard
 *    - They will redirect to:
 *      - Success: {your-domain}/payment/success
 *      - Error: {your-domain}/payment/error
 *      - Unfinish: {your-domain}/payment/unfinish
 *
 * 3. Environment Configuration:
 *    - Make sure NEXT_PUBLIC_APP_URL is set in your .env file
 *    - Example: NEXT_PUBLIC_APP_URL=https://your-domain.com
 */
