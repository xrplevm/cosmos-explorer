interface CacheEntry {
  value: Promise<string | null>;
  expiresAt: number;
  refreshing: boolean;
}

const cache = new Map<string, CacheEntry>();
const SUCCESS_TTL_MS = 6 * 60 * 60 * 1000;
const FAILURE_TTL_MS = 60_000;

async function lookup(identity: string): Promise<string | null> {
  const res = await fetch(
    `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`,
    { signal: AbortSignal.timeout(5000) }
  );

  if (!res.ok) throw new Error(`keybase lookup failed: ${res.status}`);

  const data = (await res.json()) as
    | { status?: { code?: number }; them?: { pictures?: { primary?: { url?: string } } }[] }
    | undefined;

  // Keybase soft-errors as HTTP 200 + non-zero status.code; treat as failure, don't cache null.
  if (data?.status?.code !== 0) {
    throw new Error(`keybase lookup soft error: ${data?.status?.code ?? "unknown"}`);
  }

  return data.them?.[0]?.pictures?.primary?.url ?? null;
}

export function resolveKeybaseAvatar(
  identity: string | null | undefined
): Promise<string | null> {
  if (!identity || identity.length === 0) return Promise.resolve(null);

  const cached = cache.get(identity);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  if (cached) {
    // Stale: serve the last value now, revalidate in the background (single-flight).
    if (!cached.refreshing) {
      cached.refreshing = true;
      void lookup(identity)
        .then(
          (url) => {
            cached.value = Promise.resolve(url);
            cached.expiresAt = Date.now() + SUCCESS_TTL_MS;
          },
          () => {
            cached.expiresAt = Date.now() + FAILURE_TTL_MS;
          }
        )
        .finally(() => {
          cached.refreshing = false;
        });
    }
    return cached.value;
  }

  const entry: CacheEntry = { value: Promise.resolve(null), expiresAt: Infinity, refreshing: false };

  entry.value = lookup(identity).then(
    (url) => {
      entry.expiresAt = Date.now() + SUCCESS_TTL_MS;
      return url;
    },
    () => {
      entry.expiresAt = Date.now() + FAILURE_TTL_MS;
      return null;
    }
  );

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
