import { z } from "zod";

export const ChainConfigSchema = z.object({
  adapterType: z.enum(["callisto", "xrplevm"]),
  network: z.object({
    chainId: z.string(),
    chainName: z.string(),
    chainEnv: z.enum(["mainnet", "testnet", "devnet"]),
    bech32Prefix: z.string(),
    primaryToken: z.object({
      denom: z.string(),
      displayDenom: z.string(),
      exponent: z.number().int(),
    }),
    endpoints: z.object({
      graphqlHttp: z.string().url(),
      graphqlWs: z.string().url().optional(),
    }),
  }),
  branding: z.object({
    title: z.string(),
    logoPath: z.string().optional(),
    favicon: z.string().optional(),
  }),
  features: z.object({
    proposals: z.boolean().default(true),
    accounts: z.boolean().default(true),
    evmSearch: z.boolean().default(false),
  }),
});

export type ChainConfig = z.infer<typeof ChainConfigSchema>;

export function loadChainConfig(raw: unknown): ChainConfig {
  return ChainConfigSchema.parse(raw);
}
