import { NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/billing/billingService';

/**
 * GET /api/billing/products
 * Returns active products with server-calculated pricing (paise and formatted INR).
 * The database product is authoritative.
 */
export async function GET() {
  try {
    const products = await BillingService.getActiveProducts();

    const formattedProducts = products.map((p) => {
      const pricing = BillingService.calculatePricing(p.price_inr, p.gst_rate);
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        type: p.type,
        interval: p.interval,
        pricing: {
          base_paise: pricing.subtotalPaise,
          gst_paise: pricing.gstPaise,
          total_paise: pricing.totalPaise,
          formatted_base: pricing.formattedSubtotal,
          formatted_gst: pricing.formattedGst,
          formatted_total: pricing.formattedTotal,
          gst_rate: pricing.gstRate
        }
      };
    });

    return NextResponse.json({
      success: true,
      products: formattedProducts
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: 'PRODUCTS_FETCH_ERROR',
          message: err.message || 'Failed to load products.'
        }
      },
      { status: 500 }
    );
  }
}
