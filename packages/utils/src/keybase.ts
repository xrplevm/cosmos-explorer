// Caches the in-flight promise rather than the resolved value, so concurrent callers for
// one identity share a single request. Failures expire and are retried; successes do not.
interface CacheEntry {
  value: Promise<string | null>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const FAILURE_TTL_MS = 60_000;

async function lookup(identity: string): Promise<string | null> {
  const res = await fetch(
    `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`,
    { signal: AbortSignal.timeout(5000) }
  );

  if (!res.ok) throw new Error(`keybase lookup failed: ${res.status}`);

  const data: unknown = await res.json();
  const them = (data as { them?: { pictures?: { primary?: { url?: string } } }[] } | undefined)?.them;

  return them?.[0]?.pictures?.primary?.url ?? null;
}

export function resolveKeybaseAvatar(
  identity: string | null | undefined
): Promise<string | null> {
  if (!identity || identity.length === 0) return Promise.resolve(null);

  const cached = cache.get(identity);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const entry: CacheEntry = { value: Promise.resolve(null), expiresAt: Infinity };

  entry.value = lookup(identity).catch(() => {
    entry.expiresAt = Date.now() + FAILURE_TTL_MS;
    return null;
  });

  cache.set(identity, entry);
  return entry.value;
}

export async function resolveKeybaseAvatars(
  identities: (string | null | undefined)[]
): Promise<Map<string, string | null>> {
  const unique = [...new Set(identities.filter(Boolean))] as string[];
  const results = new Map<string, string | null>();

  await Promise.all(
    unique.map(async (id) => {
      results.set(id, await resolveKeybaseAvatar(id));
    })
  );

  return results;
}
