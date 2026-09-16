-- ==============================================================================
-- INGRESS WITHIN: PRODUCTION BILLING, SUBSCRIPTIONS & ENTITLEMENTS SCHEMA
-- ==============================================================================
-- Scope: Real dynamic billing with Razorpay, subscriptions, orders, invoices,
--        payment methods, entitlements, and webhooks.
-- Currency: INR (all monetary values stored in integer paise).
-- Base product: SELF_HELP_MONTHLY (49900 paise = ₹499.00, GST 18% = ₹89.82, Total = ₹588.82)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('subscription', 'one_time')),
    price_inr INTEGER NOT NULL, -- Integer paise (e.g. 49900 = ₹499.00)
    gst_rate NUMERIC(4,2) NOT NULL DEFAULT 0.18, -- 18% GST standard
    interval VARCHAR(50) CHECK (interval IN ('monthly', 'yearly', NULL)),
    gateway_plan_id TEXT, -- Razorpay Plan ID (e.g. plan_...)
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist if table previously created
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_inr INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gst_rate NUMERIC(4,2) DEFAULT 0.18;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS interval VARCHAR(50);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gateway_plan_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- 3. CUSTOMERS TABLE (Mapping user to gateway customer)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    gateway_customer_id TEXT, -- Razorpay customer ID (cust_...)
    email TEXT,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_user ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_gateway ON public.customers(gateway_customer_id);

-- 4. ORDERS TABLE (One-time module / touch pack orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    amount_subtotal INTEGER NOT NULL, -- Integer paise
    amount_gst INTEGER NOT NULL,      -- Integer paise
    amount_total INTEGER NOT NULL,    -- Integer paise
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    gateway_order_id TEXT UNIQUE,     -- Razorpay Order ID (order_...)
    gateway_payment_id TEXT,          -- Razorpay Payment ID (pay_...)
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
    idempotency_key TEXT UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_gateway ON public.orders(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 5. SUBSCRIPTIONS TABLE (Recurring monthly subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    gateway_subscription_id TEXT UNIQUE NOT NULL, -- Razorpay Subscription ID (sub_...)
    status VARCHAR(50) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authenticated', 'active', 'pending', 'past_due', 'halted', 'cancelled', 'completed', 'expired')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    total_count INTEGER DEFAULT 12,
    paid_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_gateway ON public.subscriptions(gateway_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 6. ENTITLEMENTS TABLE (Feature / module / subscription access grants)
CREATE TABLE IF NOT EXISTS public.entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('subscription', 'order', 'grant')),
    source_id UUID,
    feature_key TEXT NOT NULL, -- e.g. 'self_help_subscription', 'module_m1', etc.
    is_active BOOLEAN NOT NULL DEFAULT true,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_feature UNIQUE (user_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_active ON public.entitlements(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_entitlements_feature ON public.entitlements(feature_key);

-- 7. INVOICES TABLE (Sequential real invoices generated upon confirmed payment)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL, -- Format: INV-YYYY-XXXXX
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    amount_subtotal INTEGER NOT NULL, -- Integer paise
    amount_gst INTEGER NOT NULL,      -- Integer paise
    amount_total INTEGER NOT NULL,    -- Integer paise
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'unpaid', 'void')),
    gateway_invoice_id TEXT,
    gateway_payment_id TEXT,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);

-- 8. PAYMENT METHODS TABLE (Safely stored mandate / payment method metadata)
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('upi', 'card', 'netbanking')),
    gateway_token_id TEXT,
    masked_account TEXT, -- e.g. 'username@upi' or '•••• 4242'
    card_network TEXT,   -- e.g. 'Visa', 'Mastercard', 'RuPay'
    is_default BOOLEAN NOT NULL DEFAULT true,
    mandate_status VARCHAR(50) CHECK (mandate_status IN ('active', 'revoked', 'failed', NULL)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods(user_id);

-- 9. REFUNDS TABLE
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    gateway_refund_id TEXT UNIQUE NOT NULL,
    gateway_payment_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refunds_user ON public.refunds(user_id);

-- 10. WEBHOOK EVENTS TABLE (Strict idempotency and audit trail)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL, -- Razorpay event ID (x-razorpay-event-id or payload.event_id)
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'products_select_policy' AND tablename = 'products') THEN
        CREATE POLICY products_select_policy ON public.products FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Customers: Users can only read their own customer record
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'customers_select_policy' AND tablename = 'customers') THEN
        CREATE POLICY customers_select_policy ON public.customers FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Orders: Users can only read their own orders
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'orders_select_policy' AND tablename = 'orders') THEN
        CREATE POLICY orders_select_policy ON public.orders FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Subscriptions: Users can only read their own subscriptions
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'subscriptions_select_policy' AND tablename = 'subscriptions') THEN
        CREATE POLICY subscriptions_select_policy ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Entitlements: Users can only read their own entitlements
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'entitlements_select_policy' AND tablename = 'entitlements') THEN
        CREATE POLICY entitlements_select_policy ON public.entitlements FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Invoices: Users can only read their own invoices
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'invoices_select_policy' AND tablename = 'invoices') THEN
        CREATE POLICY invoices_select_policy ON public.invoices FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Payment Methods: Users can only read their own payment methods
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payment_methods_select_policy' AND tablename = 'payment_methods') THEN
        CREATE POLICY payment_methods_select_policy ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Refunds: Users can only read their own refunds
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'refunds_select_policy' AND tablename = 'refunds') THEN
        CREATE POLICY refunds_select_policy ON public.refunds FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- 12. SEED INITIAL PRODUCTS
INSERT INTO public.products (sku, name, description, type, price_inr, gst_rate, interval, is_active)
VALUES (
    'SELF_HELP_MONTHLY',
    'Self-Work Platform',
    'Unlimited daily guided and free-flow journaling, weekly pattern reports, 30-day synthesis, and 19 psychoeducation modules.',
    'subscription',
    49900, -- ₹499.00 in paise
    0.18,  -- 18% GST (₹89.82) -> Total = ₹588.82
    'monthly',
    true
)
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price_inr = EXCLUDED.price_inr,
    gst_rate = EXCLUDED.gst_rate,
    interval = EXCLUDED.interval,
    is_active = true,
    updated_at = now();
