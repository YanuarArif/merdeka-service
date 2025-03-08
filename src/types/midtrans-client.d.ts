declare module "midtrans-client" {
  interface Config {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface NotificationResponse {
    order_id: string;
    transaction_status: string;
    fraud_status?: string;
    status_code: string;
    payment_type: string;
  }

  export class Snap {
    constructor(config: Config);
    createTransaction(parameter: any): Promise<{
      token: string;
      redirect_url: string;
    }>;
    transaction: {
      notification(response: any): Promise<NotificationResponse>;
      status(orderId: string): Promise<NotificationResponse>;
    };
  }

  export class CoreApi {
    constructor(config: Config);
    transaction: {
      notification(response: any): Promise<NotificationResponse>;
      status(orderId: string): Promise<NotificationResponse>;
    };
  }
}
