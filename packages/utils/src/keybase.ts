const cache = new Map<string, string | null>();

export async function resolveKeybaseAvatar(
  identity: string | null | undefined
): Promise<string | null> {
  if (!identity || identity.length === 0) return null;

  const cached = cache.get(identity);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(
      `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`
    );

    if (!res.ok) {
      cache.set(identity, null);
      return null;
    }

    const data = await res.json();
    const url: string | null =
      data?.them?.[0]?.pictures?.primary?.url ?? null;

    cache.set(identity, url);
    return url;
  } catch {
    cache.set(identity, null);
    return null;
  }
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
