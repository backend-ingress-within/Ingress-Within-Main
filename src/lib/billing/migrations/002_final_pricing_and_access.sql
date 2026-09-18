-- ==============================================================================
-- INGRESS WITHIN: 002_FINAL_PRICING_AND_ACCESS.SQL
-- Migration: Final Product Pricing & Access Control Migration
-- ==============================================================================
-- 1. Ingress Within has EXACTLY ONE subscription plan:
--    SKU: SELF_HELP_MONTHLY
--    Name: Ingress Within Self-Work
--    Total Customer Price: ?499.00 / 49900 paise (GST INCLUSIVE)
--    Internal accounting:
--      Taxable subtotal: ?422.88 / 42288 paise
--      18% GST: ?76.12 / 7612 paise
--      Invariant: 42288 + 7612 = 49900 paise
-- 2. Deactivate any legacy/alternate subscription products.
-- ==============================================================================

-- 1. UPSERT THE AUTHORITATIVE SINGLE SUBSCRIPTION PRODUCT
INSERT INTO public.products (
    sku,
    name,
    description,
    type,
    price_inr,
    gst_rate,
    interval,
    is_active,
    metadata
)
VALUES (
    'SELF_HELP_MONTHLY',
    'Ingress Within Self-Work',
    'Unlimited daily guided and free-flow journaling, weekly pattern reports, 30-day synthesis, and therapeutic self-work exercises.',
    'subscription',
    49900, -- 49900 paise = ?499.00 GST inclusive
    0.18,  -- 18% GST (internal accounting: 42288 paise subtotal + 7612 paise GST = 49900 paise)
    'monthly',
    true,
    '{"pricing_type": "gst_inclusive", "subtotal_paise": 42288, "gst_paise": 7612, "total_paise": 49900}'::jsonb
)
ON CONFLICT (sku) DO UPDATE SET
 name = EXCLUDED.name,
 description = EXCLUDED.description,
 type = EXCLUDED.type,
 price_inr = EXCLUDED.price_inr,
 gst_rate = EXCLUDED.gst_rate,
 interval = EXCLUDED.interval,
 is_active = true,
 metadata = EXCLUDED.metadata,
 updated_at = now();

-- 2. DEACTIVATE ANY OTHER SUBSCRIPTION PRODUCTS TO GUARANTEE EXACTLY ONE ACTIVE SUBSCRIPTION PLAN
UPDATE public.products
SET is_active = false, updated_at = now()
WHERE type = 'subscription' AND sku != 'SELF_HELP_MONTHLY';
