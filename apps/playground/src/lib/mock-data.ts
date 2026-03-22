export const mockBlocks = [
  { height: 1_234_567, proposer: "Validator A", hash: "A1B2C3D4E5F6A1B2C3D4E5F6", txs: 12, time: "3s ago" },
  { height: 1_234_566, proposer: "Validator B", hash: "F6E5D4C3B2A1F6E5D4C3B2A1", txs: 5, time: "9s ago" },
  { height: 1_234_565, proposer: "Validator C", hash: "1A2B3C4D5E6F1A2B3C4D5E6F", txs: 0, time: "15s ago" },
  { height: 1_234_564, proposer: "Validator A", hash: "6F5E4D3C2B1A6F5E4D3C2B1A", txs: 8, time: "21s ago" },
  { height: 1_234_563, proposer: "Validator D", hash: "B1C2D3E4F5A6B1C2D3E4F5A6", txs: 3, time: "27s ago" },
  { height: 1_234_562, proposer: "Validator B", hash: "A6F5E4D3C2B1A6F5E4D3C2B1", txs: 1, time: "33s ago" },
  { height: 1_234_561, proposer: "Validator E", hash: "D3E4F5A6B1C2D3E4F5A6B1C2", txs: 6, time: "39s ago" },
];

export const mockTransactions = [
  { hash: "A1B2C3D4E5F6A1B2C3D4E5F6", type: "/cosmos.bank.v1beta1.MsgSend", success: true, time: "5s ago" },
  { hash: "F6E5D4C3B2A1F6E5D4C3B2A1", type: "/cosmos.staking.v1beta1.MsgDelegate", success: true, time: "12s ago" },
  { hash: "1A2B3C4D5E6F1A2B3C4D5E6F", type: "/cosmos.gov.v1.MsgVote", success: false, time: "18s ago" },
  { hash: "6F5E4D3C2B1A6F5E4D3C2B1A", type: "/cosmos.bank.v1beta1.MsgSend", success: true, time: "25s ago" },
  { hash: "B1C2D3E4F5A6B1C2D3E4F5A6", type: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward", success: true, time: "31s ago" },
  { hash: "A6F5E4D3C2B1A6F5E4D3C2B1", type: "/cosmos.staking.v1beta1.MsgUndelegate", success: false, time: "38s ago" },
  { hash: "D3E4F5A6B1C2D3E4F5A6B1C2", type: "/cosmos.bank.v1beta1.MsgSend", success: true, time: "45s ago" },
];

export const mockValidators = [
  { rank: 1, moniker: "Chorus One", status: "Active" as const, votingPower: 1_250_000, commission: 5.0, missedBlocks: 12 },
  { rank: 2, moniker: "Figment", status: "Active" as const, votingPower: 980_000, commission: 8.0, missedBlocks: 3 },
  { rank: 3, moniker: "Everstake", status: "Active" as const, votingPower: 870_000, commission: 5.0, missedBlocks: 0 },
  { rank: 4, moniker: "Coinbase Cloud", status: "Active" as const, votingPower: 650_000, commission: 10.0, missedBlocks: 45 },
  { rank: 5, moniker: "Allnodes", status: "Active" as const, votingPower: 520_000, commission: 3.0, missedBlocks: 1 },
  { rank: 6, moniker: "P2P.org", status: "Inactive" as const, votingPower: 310_000, commission: 7.0, missedBlocks: 890 },
  { rank: 7, moniker: "SG-1", status: "Jailed" as const, votingPower: 150_000, commission: 5.0, missedBlocks: 5_400 },
];

export const mockBalances = [
  { denom: "uxrp", amount: "1500000000" },
  { denom: "uatom", amount: "250000000" },
  { denom: "uosmo", amount: "75000000" },
  { denom: "stake", amount: "10000000" },
  { denom: "uusdc", amount: "500000000" },
  { denom: "uweth", amount: "3000000" },
  { denom: "ulink", amount: "120000000" },
];

export const mockDelegations = [
  { validator: "Chorus One", address: "cosmosvaloper1abc...def", amount: "500000000", denom: "uxrp", rewards: "12500000" },
  { validator: "Figment", address: "cosmosvaloper1ghi...jkl", amount: "300000000", denom: "uxrp", rewards: "8200000" },
  { validator: "Everstake", address: "cosmosvaloper1mno...pqr", amount: "200000000", denom: "uxrp", rewards: "5100000" },
  { validator: "Allnodes", address: "cosmosvaloper1stu...vwx", amount: "100000000", denom: "uxrp", rewards: "2800000" },
  { validator: "P2P.org", address: "cosmosvaloper1yza...bcd", amount: "50000000", denom: "uxrp", rewards: "1400000" },
  { validator: "Coinbase Cloud", address: "cosmosvaloper1efg...hij", amount: "80000000", denom: "uxrp", rewards: "1900000" },
  { validator: "SG-1", address: "cosmosvaloper1klm...nop", amount: "25000000", denom: "uxrp", rewards: "600000" },
];

export const mockProposals = [
  { id: 42, title: "Enable IBC Transfers", status: "Passed" as const, type: "SoftwareUpgrade", submitTime: "2026-03-01", votingEnd: "2026-03-15" },
  { id: 41, title: "Community Pool Spend for Developer Grants", status: "Voting" as const, type: "CommunityPoolSpend", submitTime: "2026-03-10", votingEnd: "2026-03-24" },
  { id: 40, title: "Parameter Change: Max Validators", status: "Rejected" as const, type: "ParameterChange", submitTime: "2026-02-20", votingEnd: "2026-03-06" },
  { id: 39, title: "Software Upgrade v2.0.0", status: "Passed" as const, type: "SoftwareUpgrade", submitTime: "2026-02-10", votingEnd: "2026-02-24" },
  { id: 38, title: "Text Proposal: Governance Framework", status: "Deposit" as const, type: "Text", submitTime: "2026-03-12", votingEnd: null },
  { id: 37, title: "Increase Gas Limit Parameter", status: "Passed" as const, type: "ParameterChange", submitTime: "2026-01-15", votingEnd: "2026-01-29" },
  { id: 36, title: "Fund Security Audit", status: "Rejected" as const, type: "CommunityPoolSpend", submitTime: "2026-01-05", votingEnd: "2026-01-19" },
];

/* ─── Mock Proposal Details (ProposalDetail shape from @cosmos-explorer/core) ── */

const baseTally = {
  yes: "15000000",
  no: "2000000",
  abstain: "500000",
  noWithVeto: "100000",
  bondedTokens: { amount: "26000000", denom: "axrp" },
};

export const mockProposalDetails = {
  softwareUpgrade: {
    id: 42,
    title: "Enable IBC Transfers",
    description: "The XRPL EVM sidechain upgrade v10.0.0 is ready to migrate Cosmos EVM v0.4.2 to v0.6.0, a fully supported fork of Cosmos EVM.",
    proposer: "ethm1z4f0lx5t3mwxq9799nlefpz7v0s0t0eed7w3w8",
    status: "passed" as const,
    type: "SoftwareUpgrade",
    submitTime: "2026-02-19T18:53:18Z",
    votingEndTime: "2026-02-20T18:53:18Z",
    metadata: "ipfs://CID",
    depositEndTime: "2026-02-21T18:53:18Z",
    votingStartTime: "2026-02-19T18:53:18Z",
    tally: baseTally,
    content: [{
      "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
      authority: "ethm1z4f0lx5t3mwxq9799nlefpz7v0s0t0eed7w3w8",
      plan: {
        name: "v10.0.0",
        height: "5601606",
        time: "0001-01-01T00:00:00Z",
        info: '{"binaries":{"linux/amd64":"https://github.com/xrplevm/node/releases/download/v10.0.0/node_10.0.0_Linux_amd64.tar.gz","linux/arm64":"https://github.com/xrplevm/node/releases/download/v10.0.0/node_10.0.0_Linux_arm64.tar.gz"}}',
        upgraded_client_state: null,
      },
    }],
  },

  communityPoolSpend: {
    id: 41,
    title: "Community Pool Spend for Developer Grants",
    description: "Allocate 50,000 XRP from the community pool to fund developer grants for Q2 2026.",
    proposer: "ethm1abc123def456ghi789jkl012mno345pqr678stu",
    status: "voting" as const,
    type: "CommunityPoolSpend",
    submitTime: "2026-03-10T12:00:00Z",
    votingEndTime: "2026-03-24T12:00:00Z",
    metadata: null,
    depositEndTime: "2026-03-12T12:00:00Z",
    votingStartTime: "2026-03-12T12:00:00Z",
    tally: { ...baseTally, yes: "8000000", no: "5000000" },
    content: [{
      "@type": "/cosmos.distribution.v1beta1.MsgCommunityPoolSpend",
      authority: "ethm1govmoduleaddress000000000000000000000",
      recipient: "ethm1grantrecipient999888777666555444333222",
      amount: [{ denom: "axrp", amount: "50000000000000000000000" }],
    }],
  },

  parameterChange: {
    id: 40,
    title: "Parameter Change: Max Validators",
    description: "Increase the maximum number of active validators from 100 to 150 to improve network decentralization.",
    proposer: "ethm1validator999888777666555444333222111000",
    status: "rejected" as const,
    type: "ParameterChange",
    submitTime: "2026-02-20T08:00:00Z",
    votingEndTime: "2026-03-06T08:00:00Z",
    metadata: null,
    depositEndTime: "2026-02-22T08:00:00Z",
    votingStartTime: "2026-02-22T08:00:00Z",
    tally: { ...baseTally, yes: "3000000", no: "12000000" },
    content: [{
      "@type": "/cosmos.params.v1beta1.ParameterChangeProposal",
      changes: [
        { subspace: "staking", key: "MaxValidators", value: "150" },
        { subspace: "staking", key: "BondDenom", value: "axrp" },
      ],
    }],
  },

  text: {
    id: 38,
    title: "Text Proposal: Governance Framework",
    description: "This proposal outlines a governance framework for the XRPL EVM sidechain.\n\n1. All major parameter changes require a 2-week voting period.\n2. Software upgrades must include a testnet validation period of at least 1 week.\n3. Community pool spend proposals exceeding 100,000 XRP require a supermajority.\n\nThis is a signaling proposal and does not enact on-chain changes.",
    proposer: "ethm1communitymod000111222333444555666777888",
    status: "deposit" as const,
    type: "Text",
    submitTime: "2026-03-12T10:00:00Z",
    votingEndTime: null,
    metadata: null,
    depositEndTime: "2026-03-14T10:00:00Z",
    votingStartTime: null,
    tally: null,
    content: [{
      "@type": "/cosmos.gov.v1beta1.TextProposal",
    }],
  },

  addValidator: {
    id: 35,
    title: "Add Validator: Peersyst Technology",
    description: "Proposal to add Peersyst Technology as a new validator on the XRPL EVM sidechain.",
    proposer: "ethm1z4f0lx5t3mwxq9799nlefpz7v0s0t0eed7w3w8",
    status: "passed" as const,
    type: "AddValidator",
    submitTime: "2026-01-10T14:00:00Z",
    votingEndTime: "2026-01-24T14:00:00Z",
    metadata: null,
    depositEndTime: "2026-01-12T14:00:00Z",
    votingStartTime: "2026-01-12T14:00:00Z",
    tally: baseTally,
    content: [{
      "@type": "/xrplevm.poa.v1.MsgAddValidator",
      authority: "ethm1govmoduleaddress000000000000000000000",
      validator_address: "ethvaloper1peersyst999888777666555444333222111",
      description: {
        moniker: "Peersyst Technology",
        identity: "AABB1122CCDD3344",
        website: "https://peersyst.com",
        security_contact: "security@peersyst.com",
        details: "Enterprise blockchain infrastructure provider",
      },
      commission: {
        rate: "0.050000000000000000",
        max_rate: "0.200000000000000000",
        max_change_rate: "0.010000000000000000",
      },
      min_self_delegation: "1000000",
    }],
  },

  removeValidator: {
    id: 34,
    title: "Remove Validator: Inactive Node",
    description: "Proposal to remove an inactive validator that has been jailed for over 30 days with no recovery.",
    proposer: "ethm1z4f0lx5t3mwxq9799nlefpz7v0s0t0eed7w3w8",
    status: "passed" as const,
    type: "RemoveValidator",
    submitTime: "2026-01-05T09:00:00Z",
    votingEndTime: "2026-01-19T09:00:00Z",
    metadata: null,
    depositEndTime: "2026-01-07T09:00:00Z",
    votingStartTime: "2026-01-07T09:00:00Z",
    tally: baseTally,
    content: [{
      "@type": "/xrplevm.poa.v1.MsgRemoveValidator",
      authority: "ethm1govmoduleaddress000000000000000000000",
      validator_address: "ethvaloper1inactive000999888777666555444333",
      description: { moniker: "Inactive Node" },
    }],
  },

  cancelUpgrade: {
    id: 33,
    title: "Cancel Software Upgrade v9.5.0",
    description: "Cancel the pending v9.5.0 upgrade due to a critical bug discovered during testnet validation.",
    proposer: "ethm1z4f0lx5t3mwxq9799nlefpz7v0s0t0eed7w3w8",
    status: "passed" as const,
    type: "CancelUpgrade",
    submitTime: "2025-12-20T16:00:00Z",
    votingEndTime: "2026-01-03T16:00:00Z",
    metadata: null,
    depositEndTime: "2025-12-22T16:00:00Z",
    votingStartTime: "2025-12-22T16:00:00Z",
    tally: baseTally,
    content: [{
      "@type": "/cosmos.upgrade.v1beta1.MsgCancelUpgrade",
      authority: "ethm1govmoduleaddress000000000000000000000",
    }],
  },

  updateParams: {
    id: 32,
    title: "Update EVM Module Parameters",
    description: "Update the EVM module gas parameters to optimize transaction throughput.",
    proposer: "ethm1abc123def456ghi789jkl012mno345pqr678stu",
    status: "passed" as const,
    type: "UpdateParams",
    submitTime: "2025-12-15T11:00:00Z",
    votingEndTime: "2025-12-29T11:00:00Z",
    metadata: null,
    depositEndTime: "2025-12-17T11:00:00Z",
    votingStartTime: "2025-12-17T11:00:00Z",
    tally: baseTally,
    content: [{
      "@type": "/cosmos.evm.v1.MsgUpdateParams",
      authority: "ethm1govmoduleaddress000000000000000000000",
      params: {
        evm_denom: "axrp",
        extra_eips: [],
        chain_config: { chain_id: "1440002" },
        allow_unprotected_txs: false,
      },
    }],
  },
};

export function formatHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-5)}`;
}

export function formatTokenAmount(amount: string, denom: string, decimals = 6): string {
  const num = Number(amount) / 10 ** decimals;
  return `${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: decimals })} ${denom}`;
}
