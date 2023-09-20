export interface LicenseKey {
    id: number;
    status: string;
    key: string;
    activation_limit: number;
    activation_usage: number;
    created_at: string;
    expires_at: string | null;
}

export interface Instance {
    id: string;
    name: string;
    created_at: string;
}

export interface Meta {
    store_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    product_name: string;
    variant_id: number;
    variant_name: string;
    customer_id: number;
    customer_name: string;
    customer_email: string;
}

export interface LemonAPIResponse {
    activated: boolean;
    error: string | null;
    license_key: LicenseKey;
    instance: Instance;
    meta: Meta;
}

export interface LemonAPIResponseValidateKey {
    valid: boolean;
    error: string | null;
    license_key: LicenseKey;
    instance: Instance;
    meta: Meta;
}
