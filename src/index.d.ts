interface GPaymentsOptions {
  clientId?: string;
  clientSecret?: string;
}

interface GPaymentsMe<T = any> {
  fetch: () => Promise<T>;
  update: (data: T) => Promise<T>;
}

interface GPaymentsCustomers<T = any> {
  create: (data: T) => Promise<T>;
  fetch: (key: string | undefined) => Promise<T>;
  update: (key: string, data: T) => Promise<T>;
  remove: (key: string) => Promise<T>;
}

interface GPaymentsChargeResponse {
  refund_id?: string;
  charge_id: string;
  customer: null | string;
  charge_by_customer: boolean;
  charge_log: {
    status: string;
    reason?: string;
    description: string;
    entity_description: string;
    currency: string;
    amount: number;
    card: {
      last4: string;
      brand: string;
      exp_year: number;
      cvc: string;
      exp_month: number;
    };
  };
  created_on: string;
  created_on_pretty: string;
  created_on_date: string;
  test: boolean;
}

interface GPaymentsCharges<T = any> {
  create: (data: T) => Promise<GPaymentsChargeResponse>;
  logs: (id: string | undefined) => T;
}

interface GPaymentsPlans<T = any> {
  fetch: (key: string | undefined) => Promise<T>;
  create: (data: T) => Promise<T>;
  remove: (key: string) => Promise<T>;
}

interface GPaymentsSubscriptions<T = any> {
  subscribe: (data: T) => Promise<T>;
  unsubscribe: (id: string) => Promise<T>;
  fetch: (id: string | undefined) => Promise<T>;
}

type GPaymentsInstance = (options?: GPaymentsOptions) => {
  me: GPaymentsMe;
  plans: GPaymentsPlans;
  charges: GPaymentsCharges;
  customers: GPaymentsCustomers;
  subscriptions: GPaymentsSubscriptions;
}

declare const GPayments: GPaymentsInstance;

export default GPayments;
