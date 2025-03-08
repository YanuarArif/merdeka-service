import midtransClient from "midtrans-client";

// Create Snap API instance
export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});

// Create Core API instance for handling notifications
export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});

export type PaymentDetails = {
  orderId: string;
  amount: number;
  customerDetails?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
};

export async function createTransaction(paymentDetails: PaymentDetails) {
  const parameter = {
    transaction_details: {
      order_id: paymentDetails.orderId,
      gross_amount: paymentDetails.amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: paymentDetails.customerDetails,
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    };
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    throw error;
  }
}
