import { resolveKeybaseAvatars } from '@cosmos-explorer/utils';

export async function withResolvedAvatars<
  T extends { _identity: string | null; avatarUrl: string | null },
>(
  items: T[]
): Promise<(Omit<T, '_identity' | 'avatarUrl'> & { avatarUrl: string | null })[]> {
  const avatarMap = await resolveKeybaseAvatars(items.map((item) => item._identity));

  return items.map(({ _identity, avatarUrl: _placeholder, ...rest }) => ({
    ...rest,
    avatarUrl: _identity ? (avatarMap.get(_identity) ?? null) : null,
  }));
}
