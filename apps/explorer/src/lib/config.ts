import { cache } from "react";
import { loadChainConfig } from "@cosmos-explorer/config";
import { devnetConfig, mainnetConfig, testnetConfig } from "@/config";

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

function buildConfigFromEnv() {
  const chainEnv = requireEnv("NETWORK");
  switch (chainEnv) {
    case "mainnet":
      return mainnetConfig;
    case "testnet":
      return testnetConfig;
    case "devnet":
      return devnetConfig;
    default:
      throw new Error(`Invalid network environment: ${chainEnv}`);
  }
}

export const getChainConfig = cache(() =>
  loadChainConfig(buildConfigFromEnv()),
);
