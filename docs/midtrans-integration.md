# Midtrans Payment Integration Guide

## Configuration Setup

### 1. Environment Variables

Add these variables to your `.env` file:

```env
NEXT_PUBLIC_APP_URL=your_application_url
NEXT_PUBLIC_MIDTRANS_SERVER_KEY=your_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
```

### 2. Midtrans Dashboard Configuration

Configure these URLs in your Midtrans dashboard:

1. **Payment Notification URL**

   - URL: `{your_domain}/api/payment/notification`
   - This handles asynchronous payment status updates
   - Required for real-time order status updates

2. **Redirect URLs**
   These are handled automatically by our integration:
   - Success: `{your_domain}/payment/success`
   - Error: `{your_domain}/payment/error`
   - Unfinish: `{your_domain}/payment/unfinish`

### 3. Order Status Flow

Payment statuses are handled as follows:

```
Payment Initiated
  ↓
[Pending] → User completes payment → [Processing]
  ↓                                    ↓
[Cancelled]                         [Completed]
```

### 4. Testing

1. Use Midtrans sandbox credentials for testing
2. Test card details:
   - Card Number: 4811 1111 1111 1114
   - Expiry: Any future date
   - CVV: Any 3 digits

### 5. Notification Handling

The system automatically:

- Updates order status based on payment notifications
- Handles payment success/failure scenarios
- Updates the database with payment status

### 6. Troubleshooting

If payment notifications aren't working:

1. Verify the notification URL is correctly set in Midtrans dashboard
2. Ensure your server is accessible from Midtrans servers
3. Check server logs for any notification handling errors
4. Verify environment variables are correctly set

## Important Notes

- Always test payments in sandbox mode first
- Monitor payment notifications in production
- Keep your Midtrans keys secure
- Regularly check payment logs for any issues
