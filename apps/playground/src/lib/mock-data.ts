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

export function formatHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-5)}`;
}

export function formatTokenAmount(amount: string, denom: string, decimals = 6): string {
  const num = Number(amount) / 10 ** decimals;
  return `${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: decimals })} ${denom}`;
}
