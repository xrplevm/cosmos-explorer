import { bech32 } from 'bech32';

/**
 * Returns true if the string looks like an EVM hex address (`0x` + 40 hex chars).
 */
export function isEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/i.test(address);
}

/**
 * Converts an EVM hex address (`0x...`) to a bech32 Cosmos address with the given prefix.
 * Returns the original address unchanged if it is not a valid EVM address.
 */
export function evmToCosmosAddress(evmAddress: string, prefix: string): string {
  if (!isEvmAddress(evmAddress)) {
    return evmAddress;
  }

  const hexBytes = evmAddress.slice(2);
  const data: number[] = [];
  for (let i = 0; i < hexBytes.length; i += 2) {
    data.push(parseInt(hexBytes.slice(i, i + 2), 16));
  }

  const words = bech32.toWords(new Uint8Array(data));
  return bech32.encode(prefix, words);
}
