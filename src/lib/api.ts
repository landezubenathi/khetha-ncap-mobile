/**
 * src/lib/api.ts
 * Typed API client for NCAP / DHET interoperability.
 *
 * All mutating calls use upsert semantics to prevent duplicate records.
 * Offline writes are queued in Zustand store and flushed on reconnect.
 * Auth header is injected from the active Supabase session automatically.
 */

import { supabase } from './supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SyncStatus = 'pending' | 'synced' | 'failed';

export type ProfilePayload = {
  id: string;
  language: string;
  province: string;
  grade: string;
  consent_version: number;
  push_token?: string | null;
};

export type AssessmentPayload = {
  user_id: string;
  type: string;                          // 'career' | 'job-fit'
  answers: Record<string, number>;
  careers: Array<{ id: string; score: number; reason: string }>;
  completed_at: string;                  // ISO
};

export type SavedItemPayload = {
  user_id: string;
  item_id: string;
  item_type: 'career' | 'qualification' | 'provider';
  note: string;
  deadline: string;
  notify_me: boolean;
};

// ── Auth header helper ────────────────────────────────────────────────────────

async function authHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

// ── Generic upsert wrapper (deduplication guard) ──────────────────────────────

async function upsert<T extends object>(
  table: string,
  payload: T,
  conflictColumn: string,
): Promise<{ data: T | null; error: string | null }> {
  if (!supabase) return { data: null, error: 'offline' };
  const { data, error } = await supabase
    .from(table)
    .upsert(payload, { onConflict: conflictColumn })
    .select()
    .single();
  return { data: data as T | null, error: error?.message ?? null };
}

// ── Profile sync ──────────────────────────────────────────────────────────────

export async function syncProfile(payload: ProfilePayload) {
  return upsert('profiles', payload, 'id');
}

// ── Assessment sync (keyed by user_id + type — retake replaces) ───────────────

export async function syncAssessment(payload: AssessmentPayload) {
  return upsert('assessments', payload, 'user_id,type');
}

// ── Saved items sync ──────────────────────────────────────────────────────────

export async function syncSavedItem(payload: SavedItemPayload) {
  return upsert('saved_items', payload, 'user_id,item_id');
}

export async function deleteSavedItem(userId: string, itemId: string) {
  if (!supabase) return;
  await supabase.from('saved_items').delete().match({ user_id: userId, item_id: itemId });
}

// ── Consent log (append-only — never upsert, preserves audit trail) ───────────

export async function logConsent(payload: {
  user_id: string;
  version: number;
  data_storage: boolean;
  push_notifications: boolean;
  analytics: boolean;
  action: 'granted' | 'withdrawn';
  ip_hash?: string;                      // hashed for privacy
}) {
  if (!supabase) return;
  await supabase.from('consent_log').insert(payload);
}

// ── NCAP Career data interoperability ─────────────────────────────────────────
// Fetches canonical career data from the NCAP API and merges with local seed.
// Falls back to local seed silently when offline or API unavailable.

const NCAP_BASE = 'https://ncap.careerhelp.org.za/api/v1';

export async function fetchNCAPCareers(): Promise<null> {
  // Stub — NCAP REST API endpoint not yet publicly documented.
  // When available, replace with:
  //   const headers = await authHeaders();
  //   const res = await fetch(`${NCAP_BASE}/careers`, { headers });
  //   return res.ok ? res.json() : null;
  return null;
}

export async function fetchNCAPQualifications(): Promise<null> {
  // Stub — same pattern as fetchNCAPCareers
  return null;
}

// ── DHET Provider Registry interoperability ───────────────────────────────────
// Fetches registered TVET/university providers from DHET registry.

const DHET_BASE = 'https://register.dhet.gov.za/api/v1';

export async function fetchDHETProviders(): Promise<null> {
  // Stub — DHET provider registry API endpoint pending public access.
  return null;
}

// ── Offline sync queue flush ──────────────────────────────────────────────────
// Call this when connectivity is restored (from connectivity.tsx listener).

export type QueuedOperation = {
  id: string;
  table: string;
  payload: object;
  conflictColumn: string;
  status: SyncStatus;
  createdAt: string;
};

export async function flushSyncQueue(queue: QueuedOperation[]): Promise<QueuedOperation[]> {
  const pending = queue.filter((op) => op.status === 'pending');
  const results = await Promise.allSettled(
    pending.map((op) => upsert(op.table, op.payload, op.conflictColumn))
  );
  return queue.map((op, i) => {
    if (op.status !== 'pending') return op;
    const result = results[pending.indexOf(op)];
    return {
      ...op,
      status: result.status === 'fulfilled' && !result.value.error ? 'synced' : 'failed',
    };
  });
}
