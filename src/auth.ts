import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: Promise<SupabaseClient> | undefined;
export function auth() {
  return client ??= fetch('/api/comments?config=1').then(async response => {
    if (!response.ok) throw new Error('Not configured');
    const config = await response.json() as { url: string; anonKey: string };
    return createClient(config.url, config.anonKey);
  }).catch(error => { client = undefined; throw error; });
}
