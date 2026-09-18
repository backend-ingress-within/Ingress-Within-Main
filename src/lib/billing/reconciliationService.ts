import { supabase } from '../db';

export interface ReconciliationReport {
  timestamp: string;
  staleSubscriptionsChecked: number;
  staleSubscriptionsRepaired: number;
  duplicateSubscriptionsResolved: number;
  expiredEntitlementsDeactivated: number;
  missingEntitlementsRepaired: number;
}

/**
 * ReconciliationService provides idempotent self-healing safety net
 * for subscription, entitlement, and access control discrepancies.
 */
export class ReconciliationService {
  /**
   * Idempotent full reconciliation routine.
   * Can be executed by background cron, BullMQ worker, or health check.
   */
  public static async reconcileSubscriptions(): Promise<ReconciliationReport> {
    const report: ReconciliationReport = {
      timestamp: new Date().toISOString(),
      staleSubscriptionsChecked: 0,
      staleSubscriptionsRepaired: 0,
      duplicateSubscriptionsResolved: 0,
      expiredEntitlementsDeactivated: 0,
      missingEntitlementsRepaired: 0
    };

    const now = new Date();
    const nowIso = now.toISOString();

    // 1. Repair Stale Active Subscriptions (current_period_end has elapsed)
    try {
      const { data: staleSubs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active')
        .lt('current_period_end', nowIso);

      if (staleSubs && staleSubs.length > 0) {
        report.staleSubscriptionsChecked = staleSubs.length;
        for (const sub of staleSubs) {
          const newStatus = sub.cancel_at_period_end ? 'cancelled' : 'past_due';
          await supabase
            .from('subscriptions')
            .update({
              status: newStatus,
              updated_at: nowIso
            })
            .eq('id', sub.id);
          
          report.staleSubscriptionsRepaired++;
          console.log('[ReconciliationService] billing.reconciliation.repaired: Transitioned stale subscription ' + sub.id + ' to ' + newStatus);
        }
      }
    } catch (e: any) {
      console.warn('[ReconciliationService] Stale subscription check notice:', e.message);
    }

    // 2. Resolve Duplicate Active Subscriptions (only one active allowed per user)
    try {
      const { data: activeSubs } = await supabase
        .from('subscriptions')
        .select('id, user_id, created_at, gateway_subscription_id')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (activeSubs && activeSubs.length > 0) {
        const userSubsMap = new Map<string, typeof activeSubs>();
        for (const sub of activeSubs) {
          const list = userSubsMap.get(sub.user_id) || [];
          list.push(sub);
          userSubsMap.set(sub.user_id, list);
        }

        for (const [userId, subs] of userSubsMap.entries()) {
          if (subs.length > 1) {
            const duplicates = subs.slice(1);
            for (const dup of duplicates) {
              await supabase
                .from('subscriptions')
                .update({
                  status: 'cancelled',
                  updated_at: nowIso
                })
                .eq('id', dup.id);
              
              report.duplicateSubscriptionsResolved++;
              console.log('[ReconciliationService] billing.reconciliation.repaired: Deactivated duplicate active subscription ' + dup.id + ' for user ' + userId);
            }
          }
        }
      }
    } catch (e: any) {
      console.warn('[ReconciliationService] Duplicate subscription check notice:', e.message);
    }

    // 3. Deactivate Expired Entitlements
    try {
      const { data: expiredEnts } = await supabase
        .from('entitlements')
        .select('id, user_id, feature_key')
        .eq('is_active', true)
        .not('valid_until', 'is', null)
        .lt('valid_until', nowIso);

      if (expiredEnts && expiredEnts.length > 0) {
        for (const ent of expiredEnts) {
          await supabase
            .from('entitlements')
            .update({
              is_active: false,
              updated_at: nowIso
            })
            .eq('id', ent.id);

          report.expiredEntitlementsDeactivated++;
          console.log('[ReconciliationService] billing.entitlement.expired: Deactivated expired entitlement ' + ent.feature_key + ' for user ' + ent.user_id);
        }
      }
    } catch (e: any) {
      console.warn('[ReconciliationService] Expired entitlement check notice:', e.message);
    }

    // 4. Repair Missing Entitlements for Verified Active Subscriptions
    try {
      const { data: validActiveSubs } = await supabase
        .from('subscriptions')
        .select('id, user_id, product_id, current_period_end')
        .eq('status', 'active')
        .or('current_period_end.is.null,current_period_end.gt.' + nowIso);

      if (validActiveSubs && validActiveSubs.length > 0) {
        for (const sub of validActiveSubs) {
          const { data: ent } = await supabase
            .from('entitlements')
            .select('id, is_active')
            .eq('user_id', sub.user_id)
            .eq('feature_key', 'self_help_subscription')
            .maybeSingle();

          if (!ent || !ent.is_active) {
            await supabase
              .from('entitlements')
              .upsert({
                user_id: sub.user_id,
                product_id: sub.product_id,
                source_type: 'subscription',
                feature_key: 'self_help_subscription',
                is_active: true,
                valid_until: sub.current_period_end,
                updated_at: nowIso
              }, { onConflict: 'user_id, feature_key' });

            report.missingEntitlementsRepaired++;
            console.log('[ReconciliationService] billing.entitlement.restored: Restored missing entitlement for active subscriber ' + sub.user_id);
          }
        }
      }
    } catch (e: any) {
      console.warn('[ReconciliationService] Missing entitlement check notice:', e.message);
    }

    return report;
  }
}
