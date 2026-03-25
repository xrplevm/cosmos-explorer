import { cache } from "react";
import { loadChainConfig } from "@cosmos-explorer/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy .env.example to .env.local and fill in the values.`,
    );
  }
  return value;
}

function parseIntEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const n = parseInt(value, 10);
  if (isNaN(n)) {
    throw new Error(
      `Environment variable ${name} must be an integer, got: "${value}"`,
    );
  }
  return n;
}

function parseBoolEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(
    `Environment variable ${name} must be "true" or "false", got: "${value}"`,
  );
}

function parseJsonEnv(name: string): Record<string, string> {
  const value = requireEnv(name);
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    throw new Error(
      `Environment variable ${name} must be valid JSON, got: "${value}"`,
    );
  }
}

function buildConfigFromEnv() {
  return {
    adapterType: requireEnv("ADAPTER_TYPE"),
    network: {
      chainId: requireEnv("CHAIN_ID"),
      chainName: requireEnv("CHAIN_NAME"),
      chainEnv: requireEnv("CHAIN_ENV"),
      bech32Prefix: requireEnv("BECH32_PREFIX"),
      primaryToken: {
        denom: requireEnv("PRIMARY_TOKEN_DENOM"),
        displayDenom: requireEnv("PRIMARY_TOKEN_DISPLAY_DENOM"),
        exponent: parseIntEnv("PRIMARY_TOKEN_EXPONENT", 18),
      },
      endpoints: {
        graphqlHttp: requireEnv("GRAPHQL_HTTP"),
        graphqlWs: process.env.GRAPHQL_WS,
        evmExplorer: process.env.EVM_EXPLORER,
      },
    },
    price: {
      baseUrl: requireEnv("PRICE_BASE_URL"),
      assetsByDenom: parseJsonEnv("PRICE_ASSETS_BY_DENOM"),
    },
    branding: {
      title: requireEnv("BRANDING_TITLE"),
      description: process.env.BRANDING_DESCRIPTION,
      logoPath: process.env.BRANDING_LOGO_PATH,
      favicon: process.env.BRANDING_FAVICON,
    },
    links: {
      github: process.env.LINKS_GITHUB,
      discord: process.env.LINKS_DISCORD,
      website: process.env.LINKS_WEBSITE,
      issues: process.env.LINKS_ISSUES,
    },
    features: {
      proposals: parseBoolEnv("FEATURES_PROPOSALS", true),
      accounts: parseBoolEnv("FEATURES_ACCOUNTS", true),
      evmSearch: parseBoolEnv("FEATURES_EVM_SEARCH", false),
    },
  };
}

export const getChainConfig = cache(() => loadChainConfig(buildConfigFromEnv()));
