export interface GPaymentsOptions {
  clientId?: string;
  clientSecret?: string;
}

export interface GPaymentsMe<T = any> {
  fetch: () => Promise<T>;
  update: (data: T) => Promise<T>;
}

export interface GPaymentsCustomers<T = any> {
  create: (data: T) => Promise<T>;
  fetch: (key: string | undefined) => Promise<T>;
  update: (key: string, data: T) => Promise<T>;
  remove: (key: string) => Promise<T>;
}

export interface GPaymentsChargeResponse {
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

export interface GPaymentsCharges<T = any> {
  create: (data: T) => Promise<GPaymentsChargeResponse>;
  logs: (id: string | undefined) => T;
}

export interface GPaymentsPlans<T = any> {
  fetch: (key: string | undefined) => Promise<T>;
  create: (data: T) => Promise<T>;
  remove: (key: string) => Promise<T>;
}

export interface GPaymentsSubscriptions<T = any> {
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
