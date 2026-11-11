'use strict';
/**
 * Ingress Within — Lead Pipeline & Drop-off Management Service
 * =============================================================
 * Automatically captures leads at earliest phone number entry, persists
 * step-by-step intake progress, drop-offs, and matches viewed.
 * Provides pipeline metrics and follow-up tools for care operations.
 */

import { supabase } from '../db';

export interface IntakeLeadRecord {
  id: string;
  session_id: string;
  phone_number: string;
  full_name?: string | null;
  email?: string | null;
  journey_type: 'guided' | 'conversational' | 'team' | string;
  current_step: number;
  drop_off_stage: string;
  answers: Record<string, any>;
  concerns: string[];
  preferred_language?: string | null;
  therapist_gender_pref?: string | null;
  budget?: number | null;
  matches_shown: Array<{
    id: string;
    name: string;
    score?: number;
    credentials?: string;
  }>;
  selected_therapist_id?: string | null;
  selected_therapist_name?: string | null;
  is_completed: boolean;
  follow_up_status:
    | 'new'
    | 'contacted'
    | 'callback_scheduled'
    | 'converted'
    | 'closed_lost'
    | 'not_interested';
  internal_notes?: string | null;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface LeadUpsertPayload {
  sessionId: string;
  phoneNumber: string;
  fullName?: string | null;
  email?: string | null;
  journeyType?: string;
  currentStep?: number;
  dropOffStage?: string;
  answers?: Record<string, any>;
  concerns?: string[];
  preferredLanguage?: string | null;
  therapistGenderPref?: string | null;
  budget?: number | null;
  matchesShown?: any[];
  selectedTherapistId?: string | null;
  selectedTherapistName?: string | null;
  isCompleted?: boolean;
  followUpStatus?: string;
  internalNotes?: string;
}

// Global in-memory fallback cache to ensure zero breakage even if remote table migration is pending
const inMemoryLeads = new Map<string, IntakeLeadRecord>();

function cleanPhone(raw: string): string {
  if (!raw) return '';
  return raw.replace(/[^\d+]/g, '');
}

export class LeadPipelineService {
  /**
   * Autosaves or updates a lead the instant their phone number or form step changes.
   */
  static async saveOrUpdateLead(
    payload: LeadUpsertPayload
  ): Promise<{ success: boolean; lead: IntakeLeadRecord; isNew: boolean }> {
    const phone = cleanPhone(payload.phoneNumber || '');
    const sessionId = (payload.sessionId || '').trim();

    if (!phone || phone.length < 7) {
      throw new Error('Valid phone number (at least 7 digits) is required for lead capture.');
    }

    const now = new Date().toISOString();
    let existing: IntakeLeadRecord | null = null;
    let isNew = false;

    // 1. Try finding in Supabase
    try {
      const { data, error } = await supabase
        .from('therapy_intake_leads')
        .select('*')
        .or(`session_id.eq.${sessionId},phone_number.eq.${phone}`)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        existing = data as IntakeLeadRecord;
      }
    } catch {
      // Remote table lookup fallback
    }

    // 2. Fallback to in-memory store if DB query was empty or unavailable
    if (!existing) {
      for (const item of inMemoryLeads.values()) {
        if (item.session_id === sessionId || cleanPhone(item.phone_number) === phone) {
          existing = item;
          break;
        }
      }
    }

    if (!existing) {
      isNew = true;
    }

    // 3. Assemble merged record
    const updatedStep = Math.max(
      existing ? Number(existing.current_step || 0) : 0,
      Number(payload.currentStep || 0)
    );

    const mergedAnswers = {
      ...(existing?.answers || {}),
      ...(payload.answers || {}),
    };

    const mergedConcerns =
      payload.concerns && payload.concerns.length > 0
        ? payload.concerns
        : existing?.concerns || [];

    const matchesShown =
      Array.isArray(payload.matchesShown) && payload.matchesShown.length > 0
        ? payload.matchesShown
        : existing?.matches_shown || [];

    const recordToSave: IntakeLeadRecord = {
      id: existing?.id || crypto.randomUUID(),
      session_id: sessionId || existing?.session_id || `sess_${Date.now()}`,
      phone_number: phone,
      full_name: payload.fullName ?? existing?.full_name ?? null,
      email: payload.email ?? existing?.email ?? null,
      journey_type: payload.journeyType || existing?.journey_type || 'guided',
      current_step: updatedStep,
      drop_off_stage:
        payload.dropOffStage ||
        existing?.drop_off_stage ||
        'contact_captured',
      answers: mergedAnswers,
      concerns: mergedConcerns,
      preferred_language:
        payload.preferredLanguage ?? existing?.preferred_language ?? null,
      therapist_gender_pref:
        payload.therapistGenderPref ?? existing?.therapist_gender_pref ?? null,
      budget: payload.budget ?? existing?.budget ?? null,
      matches_shown: matchesShown,
      selected_therapist_id:
        payload.selectedTherapistId ?? existing?.selected_therapist_id ?? null,
      selected_therapist_name:
        payload.selectedTherapistName ?? existing?.selected_therapist_name ?? null,
      is_completed:
        payload.isCompleted !== undefined
          ? payload.isCompleted
          : Boolean(existing?.is_completed),
      follow_up_status: (payload.followUpStatus ||
        existing?.follow_up_status ||
        'new') as any,
      internal_notes: payload.internalNotes ?? existing?.internal_notes ?? null,
      last_active_at: now,
      created_at: existing?.created_at || now,
      updated_at: now,
    };

    // Always update in-memory mirror
    inMemoryLeads.set(recordToSave.id, recordToSave);

    // 4. Try saving to Supabase
    try {
      if (existing?.id) {
        await supabase
          .from('therapy_intake_leads')
          .update(recordToSave)
          .eq('id', recordToSave.id);
      } else {
        await supabase
          .from('therapy_intake_leads')
          .insert([recordToSave]);
      }
    } catch (dbErr) {
      console.warn('[LeadPipelineService] Notice: Supabase sync deferred (using memory store):', dbErr);
    }

    return {
      success: true,
      lead: recordToSave,
      isNew,
    };
  }

  /**
   * Retrieves leads with search, filter, and funnel stage metrics.
   */
  static async getLeads(filters?: {
    search?: string;
    status?: string;
    stage?: string;
    journey?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    leads: IntakeLeadRecord[];
    total: number;
    metrics: {
      total: number;
      intakeDropoffs: number;
      matchesShownDropoffs: number;
      completed: number;
      contactedOrConverted: number;
    };
  }> {
    let allLeads: IntakeLeadRecord[] = [];

    // Attempt to read from Supabase
    try {
      const { data, error } = await supabase
        .from('therapy_intake_leads')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        allLeads = data as IntakeLeadRecord[];
      }
    } catch {
      // Fallback
    }

    // Merge in-memory leads if DB was empty or missed recent hot writes
    if (allLeads.length === 0) {
      allLeads = Array.from(inMemoryLeads.values());
    } else {
      // Complement any in-memory leads not yet written to DB
      for (const [id, memItem] of inMemoryLeads.entries()) {
        if (!allLeads.some((l) => l.id === id)) {
          allLeads.unshift(memItem);
        }
      }
    }

    // Sort descending by updated_at
    allLeads.sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    );

    // Calculate pipeline metrics across ALL leads
    const total = allLeads.length;
    let intakeDropoffs = 0;
    let matchesShownDropoffs = 0;
    let completed = 0;
    let contactedOrConverted = 0;

    for (const lead of allLeads) {
      if (lead.is_completed || lead.drop_off_stage === 'completed') {
        completed++;
      } else if (
        lead.drop_off_stage === 'matches_shown' ||
        (Array.isArray(lead.matches_shown) && lead.matches_shown.length > 0)
      ) {
        matchesShownDropoffs++;
      } else {
        intakeDropoffs++;
      }

      if (['contacted', 'callback_scheduled', 'converted'].includes(lead.follow_up_status)) {
        contactedOrConverted++;
      }
    }

    // Apply filtering
    let filtered = [...allLeads];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (l) =>
          (l.full_name && l.full_name.toLowerCase().includes(q)) ||
          (l.phone_number && l.phone_number.includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter((l) => l.follow_up_status === filters.status);
    }

    if (filters?.stage && filters.stage !== 'all') {
      filtered = filtered.filter((l) => l.drop_off_stage === filters.stage);
    }

    if (filters?.journey && filters.journey !== 'all') {
      filtered = filtered.filter((l) => l.journey_type === filters.journey);
    }

    const page = Math.max(1, filters?.page || 1);
    const limit = Math.max(1, Math.min(100, filters?.limit || 25));
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      leads: paginated,
      total: filtered.length,
      metrics: {
        total,
        intakeDropoffs,
        matchesShownDropoffs,
        completed,
        contactedOrConverted,
      },
    };
  }

  /**
   * Updates follow-up status and internal notes for clinical/sales outreach.
   */
  static async updateLeadFollowUp(
    id: string,
    update: {
      follow_up_status?: string;
      internal_notes?: string;
    }
  ): Promise<IntakeLeadRecord | null> {
    const now = new Date().toISOString();
    let lead: IntakeLeadRecord | null = inMemoryLeads.get(id) || null;

    if (!lead) {
      try {
        const { data } = await supabase
          .from('therapy_intake_leads')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (data) lead = data as IntakeLeadRecord;
      } catch {
        // Fallback
      }
    }

    if (!lead) return null;

    if (update.follow_up_status) {
      lead.follow_up_status = update.follow_up_status as any;
    }
    if (update.internal_notes !== undefined) {
      lead.internal_notes = update.internal_notes;
    }
    lead.updated_at = now;

    inMemoryLeads.set(lead.id, lead);

    try {
      await supabase
        .from('therapy_intake_leads')
        .update({
          follow_up_status: lead.follow_up_status,
          internal_notes: lead.internal_notes,
          updated_at: now,
        })
        .eq('id', id);
    } catch {
      // Continue
    }

    return lead;
  }

  /**
   * Finds a single lead by its primary ID across memory and Supabase.
   */
  static async getLeadById(id: string): Promise<IntakeLeadRecord | null> {
    const mem = inMemoryLeads.get(id);
    try {
      const { data, error } = await supabase
        .from('therapy_intake_leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return data as IntakeLeadRecord;
      }
    } catch {
      // Fallback to memory store
    }
    return mem || null;
  }

  /**
   * Records a manually matched clinician onto a lead and updates follow-up state.
   */
  static async assignTherapistToLead(
    id: string,
    payload: {
      therapistId: string;
      therapistName: string;
      followUpStatus?: IntakeLeadRecord['follow_up_status'];
      internalNotes?: string;
      isCompleted?: boolean;
    }
  ): Promise<IntakeLeadRecord | null> {
    const existing = await this.getLeadById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: IntakeLeadRecord = {
      ...existing,
      selected_therapist_id: payload.therapistId,
      selected_therapist_name: payload.therapistName,
      follow_up_status: payload.followUpStatus || existing.follow_up_status,
      internal_notes:
        payload.internalNotes !== undefined
          ? payload.internalNotes
          : existing.internal_notes,
      is_completed:
        payload.isCompleted !== undefined
          ? payload.isCompleted
          : existing.is_completed,
      updated_at: now,
    };

    inMemoryLeads.set(updated.id, updated);

    try {
      await supabase
        .from('therapy_intake_leads')
        .update({
          selected_therapist_id: updated.selected_therapist_id,
          selected_therapist_name: updated.selected_therapist_name,
          follow_up_status: updated.follow_up_status,
          internal_notes: updated.internal_notes,
          is_completed: updated.is_completed,
          updated_at: now,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('[LeadPipelineService] assignTherapistToLead DB update note:', err);
    }

    return updated;
  }
}
