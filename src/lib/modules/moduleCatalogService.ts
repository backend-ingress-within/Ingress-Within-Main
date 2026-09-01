import { supabase } from '../db';
import { ModuleWithTaxonomy } from '../../types/moduleCatalog';

/**
 * Authoritative fallback catalog data for Modules M1 - M3.
 * Durations are stored strictly as metadata.
 */
export const STATIC_MODULE_CATALOG: ModuleWithTaxonomy[] = [
  {
    id: 'M1',
    slug: 'self-worth-self-talk',
    name: 'Self-Worth & Self-Talk',
    description: 'A structured psychoeducation program addressing core self-criticism, guilt, and confidence patterns through evidence-based cognitive and somatic techniques.',
    price: 349.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 7,
    taxonomy_concerns: ['M1-C01', 'M1-C02', 'M1-C03'],
    created_at: '2026-08-11T00:00:00.000Z',
    updated_at: '2026-08-11T00:00:00.000Z'
  },
  {
    id: 'M2',
    slug: 'perfectionism-avoidance',
    name: 'Perfectionism & Avoidance',
    description: 'A clinical framework targeting rigid high standards, task avoidance, and performance anxiety using ACT and exposure-based micro-practices.',
    price: 349.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 5,
    taxonomy_concerns: ['M2-C01', 'M2-C02'],
    created_at: '2026-08-11T00:00:00.000Z',
    updated_at: '2026-08-11T00:00:00.000Z'
  },
  {
    id: 'M3',
    slug: 'anxiety-worry',
    name: 'Anxiety & Worry',
    description: 'A comprehensive psychoeducation system addressing chronic rumination, panic, intrusive thoughts, and physiological hyperarousal.',
    price: 499.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 9,
    taxonomy_concerns: ['M3-C01', 'M3-C02', 'M3-C03', 'M3-C04'],
    created_at: '2026-08-11T00:00:00.000Z',
    updated_at: '2026-08-11T00:00:00.000Z'
  },
  {
    id: 'M4',
    slug: 'mood-emotional-regulation',
    name: 'Mood & Emotional Regulation',
    description: 'A clinical psychoeducation program addressing emotional overwhelm, anger/irritability, and low mood through DBT, ACT, and behavioural activation tools.',
    price: 349.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 7,
    taxonomy_concerns: ['M4-C01', 'M4-C02', 'M4-C03'],
    created_at: '2026-08-26T00:00:00.000Z',
    updated_at: '2026-08-26T00:00:00.000Z'
  },
  {
    id: 'M5',
    slug: 'identity-purpose',
    name: 'Identity & Purpose',
    description: 'A structured clinical framework addressing identity confusion, values conflicts, and lack of motivation through ACT, Narrative Therapy, and Behavioural Activation tools.',
    price: 499.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 5,
    taxonomy_concerns: ['M5-C01', 'M5-C02'],
    created_at: '2026-08-26T00:00:00.000Z',
    updated_at: '2026-08-26T00:00:00.000Z'
  },
  {
    id: 'M6',
    slug: 'trauma-past-experiences',
    name: 'Trauma & Past Experiences',
    description: 'A specialized clinical psychoeducation framework addressing present-day trauma responses, hypervigilance, and avoidance through titrated somatic grounding and narrative agency tools.',
    price: 399.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 2,
    taxonomy_concerns: ['M6-C01'],
    created_at: '2026-08-29T00:00:00.000Z',
    updated_at: '2026-08-29T00:00:00.000Z'
  },
  {
    id: 'M7',
    slug: 'emotional-suppression-masculinity-norms',
    name: 'Emotional Suppression & Masculinity Norms',
    description: 'A structured clinical framework addressing emotional suppression, vulnerability avoidance, and internalized toughness scripts using Emotion Theory, CBT, ACT, and Narrative Therapy.',
    price: 499.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 2,
    taxonomy_concerns: ['M7-C01'],
    created_at: '2026-08-29T00:00:00.000Z',
    updated_at: '2026-08-29T00:00:00.000Z'
  },
  {
    id: 'M8',
    slug: 'neurodivergence-adult-diagnosis',
    name: 'Neurodivergence & Adult Diagnosis',
    description: 'A specialized clinical psychoeducation framework exploring unrecognised neurodivergence, executive function differences, and adult diagnostic pathways using ADHD-adapted CBT, ACT, and Russell Barkley models.',
    price: 599.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 2,
    taxonomy_concerns: ['M8-C01'],
    created_at: '2026-08-29T00:00:00.000Z',
    updated_at: '2026-08-29T00:00:00.000Z'
  },
  {
    id: 'M9',
    slug: 'judged-compared',
    name: 'Judged & Compared',
    description: 'A structured family-domain psychoeducation framework addressing constant criticism, relative comparison, and high achievement pressure using CBT thought records, CFT self-compassion, assertiveness rehearsal, and ACT values work.',
    price: 349.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 7,
    taxonomy_concerns: ['M9-C01', 'M9-C02', 'M9-C03'],
    created_at: '2026-08-31T00:00:00.000Z',
    updated_at: '2026-08-31T00:00:00.000Z'
  },
  {
    id: 'M10',
    slug: 'autonomy-boundaries',
    name: 'Autonomy & Boundaries',
    description: 'A structured family-domain psychoeducation framework addressing marriage pressure, privacy boundaries, and career expectations using ACT values, IPT role transitions, DBT DEAR MAN, and existential decision-making.',
    price: 499.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 7,
    taxonomy_concerns: ['M10-C01', 'M10-C02', 'M10-C03'],
    created_at: '2026-08-31T00:00:00.000Z',
    updated_at: '2026-08-31T00:00:00.000Z'
  },
  {
    id: 'M11',
    slug: 'conflict-communication',
    name: 'Conflict & Communication',
    description: 'A structured family-domain psychoeducation framework addressing feeling misunderstood, recurring arguments, in-law dynamics, and sibling conflict using Gottman methods, IPT, EFT cycle mapping, CBT thought records, and Bowen family systems.',
    price: 499.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 9,
    taxonomy_concerns: ['M11-C01', 'M11-C02', 'M11-C03', 'M11-C04'],
    created_at: '2026-09-01T00:00:00.000Z',
    updated_at: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'M12',
    slug: 'caregiving-role-burden',
    name: 'Caregiving & Role Burden',
    description: 'A structured family-domain psychoeducation framework addressing eldercare burden, caregiver guilt, burnout, parenting stress, and decision-making anxiety using ACT values boundaries, CBT cognitive restructuring, CFT compassion training, and behavioral self-monitoring.',
    price: 499.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 5,
    taxonomy_concerns: ['M12-C01', 'M12-C02'],
    created_at: '2026-09-01T00:00:00.000Z',
    updated_at: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'M13',
    slug: 'identity-belonging-family-acceptance',
    name: 'Identity, Belonging & Family Acceptance',
    description: 'A structured family-domain psychoeducation framework addressing inter-caste/inter-religion family rejection and sexual orientation/gender identity family acceptance using ACT values clarification, Bowen family systems mapping, Narrative Therapy re-authoring, Pachankis LGBTQ+-affirmative CBT, and Meyer minority stress theory.',
    price: 399.00,
    currency: 'INR',
    status: 'active',
    version: '1.0',
    duration_weeks: 5,
    taxonomy_concerns: ['M13-C01', 'M13-C02'],
    created_at: '2026-09-01T00:00:00.000Z',
    updated_at: '2026-09-01T00:00:00.000Z'
  }
];

export class ModuleCatalogService {
  /**
   * Returns static/cached catalog items synchronously for UI components.
   */
  public static getAllCatalogItems(): ModuleWithTaxonomy[] {
    return STATIC_MODULE_CATALOG;
  }

  /**
   * Fetches all active psychoeducation modules with taxonomy mappings.
   */
  public static async getAllModules(): Promise<ModuleWithTaxonomy[]> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return STATIC_MODULE_CATALOG;
    }
    try {
      const { data: dbModules, error: modErr } = await supabase
        .from('modules')
        .select('*')
        .eq('status', 'active');

      if (modErr || !dbModules || dbModules.length === 0) {
        return STATIC_MODULE_CATALOG;
      }

      const { data: dbTaxonomy } = await supabase
        .from('module_taxonomy_mapping')
        .select('*');

      const taxonomyMap = new Map<string, string[]>();
      (dbTaxonomy || []).forEach((t: any) => {
        const list = taxonomyMap.get(t.module_id) || [];
        list.push(t.taxonomy_concern_id);
        taxonomyMap.set(t.module_id, list);
      });

      return dbModules.map((m: any) => ({
        id: m.id,
        slug: m.slug,
        name: m.name,
        description: m.description || '',
        price: Number(m.price || 0),
        currency: m.currency || 'INR',
        status: m.status || 'active',
        version: m.version || '1.0',
        duration_weeks: Number(m.duration_weeks || 1),
        taxonomy_concerns: taxonomyMap.get(m.id) || [],
        created_at: m.created_at,
        updated_at: m.updated_at
      }));
    } catch (err) {
      console.warn('[ModuleCatalogService] DB query error, using static catalog:', err);
      return STATIC_MODULE_CATALOG;
    }
  }

  /**
   * Fetches a specific module by ID (e.g. 'M1') or slug (e.g. 'self-worth-self-talk').
   */
  public static async getModuleByIdOrSlug(idOrSlug: string): Promise<ModuleWithTaxonomy | null> {
    if (!idOrSlug) return null;
    const normalized = idOrSlug.toLowerCase().trim();

    const all = await this.getAllModules();
    const match = all.find(
      m => m.id.toLowerCase() === normalized || m.slug.toLowerCase() === normalized
    );

    return match || null;
  }

  /**
   * Fetches modules mapped to a specific stable taxonomy concern ID (e.g. 'M1-C01').
   */
  public static async getModulesByTaxonomyConcern(taxonomyConcernId: string): Promise<ModuleWithTaxonomy[]> {
    if (!taxonomyConcernId) return [];
    const normalized = taxonomyConcernId.trim();

    const all = await this.getAllModules();
    return all.filter(m => m.taxonomy_concerns.includes(normalized));
  }
}
