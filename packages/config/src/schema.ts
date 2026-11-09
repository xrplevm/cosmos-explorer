import { z } from "zod";

const TokenSchema = z.object({
  denom: z.string(),
  displayDenom: z.string(),
  exponent: z.number().int(),
});

export const ChainConfigSchema = z.object({
  adapterType: z.enum(["callisto", "xrplevm"]),
  network: z.object({
    chainId: z.string(),
    chainName: z.string(),
    chainEnv: z.enum(["mainnet", "testnet", "devnet"]),
    bech32Prefix: z.string(),
    primaryToken: TokenSchema,
    stakingToken: TokenSchema,
    endpoints: z.object({
      graphqlHttp: z.url(),
      graphqlWs: z.url().optional(),
      /** Base URL for the EVM block explorer (e.g. `https://explorer.testnet.xrplevm.org`). */
      evmExplorer: z.url().optional(),
      /** Base URL for the Cosmos RPC endpoint (e.g. `https://cosmos-rpc.testnet.xrplevm.org`). */
      cosmosRpc: z.url().optional(),
    }),
  }),
  price: z.object({
    baseUrl: z.url(),
    assetsByDenom: z.record(z.string(), z.string()),
  }),
  branding: z.object({
    title: z.string(),
    description: z.string().optional(),
    logoPath: z.string().optional(),
    favicon: z.string().optional(),
  }),
  links: z
    .object({
      github: z.url().optional(),
      discord: z.url().optional(),
      website: z.url().optional(),
      issues: z.url().optional(),
    })
    .optional(),
  features: z.object({
    proposals: z.boolean().default(true),
    accounts: z.boolean().default(true),
    evmSearch: z.boolean().default(false),
  }),
  explorerUrls: z
    .partialRecord(z.enum(["mainnet", "testnet", "devnet"]), z.url())
    .optional(),
});

export type ChainConfig = z.infer<typeof ChainConfigSchema>;

export function loadChainConfig(raw: unknown): ChainConfig {
  return ChainConfigSchema.parse(raw);
}
