type GPaymentsTokenFn = (client_id: string, client_secret: string) => string;

declare const GPaymentsToken: GPaymentsTokenFn;

export default GPaymentsToken;
