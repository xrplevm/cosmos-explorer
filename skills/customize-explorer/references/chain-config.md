# Chain Configuration Schema

File: `apps/explorer/chain.json`

```jsonc
{
  // Which data adapter to use. "callisto" for Hasura/Callisto-backed chains.
  "adapterType": "callisto",

  "network": {
    "chainId": "your-chain-id",          // e.g. "cosmoshub-4", "xrplevm_1440002-1"
    "chainName": "Your Chain",           // display name
    "chainEnv": "mainnet",              // "mainnet" | "testnet" | "devnet" — shown in sidebar status
    "bech32Prefix": "cosmos",            // Bech32 address prefix

    "primaryToken": {
      "denom": "utoken",                // on-chain minimal denomination
      "displayDenom": "TOKEN",           // human-readable symbol (shown in UI)
      "exponent": 6                     // decimal places (6 for Cosmos, 18 for EVM chains)
    },

    "endpoints": {
      "graphqlHttp": "https://...",      // Callisto GraphQL HTTP endpoint (required)
      "evmExplorer": "https://..."       // external EVM explorer URL (optional)
    }
  },

  "branding": {
    "title": "Your Chain Explorer",      // page title, metadata
    "description": "Description shown in the footer."
  },

  // Optional footer links — only shown if the URL is provided
  "links": {
    "github": "https://...",
    "discord": "https://...",
    "website": "https://...",
    "issues": "https://..."
  },

  // Feature flags — toggle entire pages/features
  "features": {
    "proposals": true,                   // governance proposals page
    "accounts": true,                    // account detail page
    "evmSearch": false                   // search by 0x EVM transaction hash
  }
}
```

## Notes

- The `chainEnv` value is displayed next to a green dot in the sidebar footer
- `evmExplorer` enables "View on EVM explorer" links in EthereumTx detail pages
- Token `exponent` is used to convert raw on-chain amounts (e.g., `1000000 utoken` → `1.0 TOKEN`)
- All `links` are optional — only provided links appear in the footer
