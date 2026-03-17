import type {
  AccountDelegation,
  AccountOverview,
  AccountReward,
  Block,
  BlockDetail,
  ProposalDetail,
  ProposalStatus,
  ProposalSummary,
  TokenAmount,
  TransactionDetail,
  TransactionSummary,
  Validator,
  ValidatorCount,
  ValidatorDetail,
  ValidatorSet,
} from "@cosmos-explorer/core";

import type {
  AccountDelegationsResponse,
  AccountMessagesResponse,
  AccountRewardsResponse,
  AccountWithdrawalAddressResponse,
  AverageBlockTimeResponse,
  BlockDetailsResponse,
  LatestBlocksResponse,
  LatestTransactionsResponse,
  ProposalDetailsResponse,
  ProposalsResponse,
  TransactionDetailsResponse,
  ValidatorCountResponse,
  ValidatorDetailsResponse,
  ValidatorsResponse,
} from "./types";

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function toBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getMessageTypes(messages: unknown): string[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message) => {
      if (!message || typeof message !== "object") {
        return "";
      }

      const type = (message as { ["@type"]?: unknown })["@type"];
      return typeof type === "string" ? type : "";
    })
    .filter(Boolean);
}

function summarizeMessageTypes(types: string[]): string {
  if (types.length === 0) {
    return "Unknown";
  }

  const uniqueTypes = Array.from(new Set(types));

  if (uniqueTypes.length === 1) {
    return formatMessageType(uniqueTypes[0]);
  }

  return `${uniqueTypes.length} message types`;
}

function formatMessageType(type: string): string {
  const shortType = type.split(".").pop()?.split("/").pop() ?? type;
  return shortType.replace(/^Msg/, "") || "Unknown";
}

function getPrimaryMessageType(messages: unknown): string {
  return summarizeMessageTypes(getMessageTypes(messages));
}

export type RawBlock = Block & { _identity: string | null };
export type RawValidator = Validator & { _identity: string | null };

function mapBlockRow(block: LatestBlocksResponse["blocks"][number]): RawBlock {
  const desc = block.validator?.validatorDescriptions?.[0];
  return {
    height: toNumber(block.height),
    txs: block.txs ?? 0,
    hash: block.hash,
    timestamp: toStringValue(block.timestamp),
    proposer: block.validator?.validatorInfo?.operatorAddress ?? "",
    proposerMoniker: desc?.moniker ?? null,
    proposerAvatarUrl: null,
    _identity: desc?.identity ?? null,
  };
}

export function mapBlocks(response: LatestBlocksResponse): RawBlock[] {
  return response.blocks.map(mapBlockRow);
}

function mapTransactionRow(
  transaction: LatestTransactionsResponse["transactions"][number],
): TransactionSummary {
  const types = getMessageTypes(transaction.messages);

  return {
    hash: transaction.hash,
    height: toNumber(transaction.height),
    type: summarizeMessageTypes(types),
    success: transaction.success,
    timestamp: toStringValue(transaction.block.timestamp),
    messageCount: types.length,
  };
}

export function mapTransactions(
  response: LatestTransactionsResponse,
): TransactionSummary[] {
  return response.transactions.map(mapTransactionRow);
}

export function mapBlockDetail(
  response: BlockDetailsResponse,
): BlockDetail | null {
  const block = response.block[0];

  if (!block) {
    return null;
  }

  return {
    overview: mapBlockRow(block),
    signatures: response.preCommits
      .map(
        (preCommit) =>
          preCommit.validator?.validatorInfo?.operatorAddress ?? "",
      )
      .filter(Boolean),
    transactions: response.transactions.map(mapTransactionRow),
  };
}

export function mapTransactionDetail(
  response: TransactionDetailsResponse,
): TransactionDetail | null {
  const transaction = response.transaction[0];

  if (!transaction) {
    return null;
  }

  return {
    hash: transaction.hash,
    height: toNumber(transaction.height),
    timestamp: toStringValue(transaction.block.timestamp),
    fee: transaction.fee,
    gasUsed: toNumber(transaction.gasUsed),
    gasWanted: toNumber(transaction.gasWanted),
    success: transaction.success,
    memo: toStringValue(transaction.memo),
    error: toStringValue(transaction.rawLog),
    messages: mapMessages(transaction.messages),
    logs: transaction.logs,
  };
}

export function mapValidatorCount(
  response: ValidatorCountResponse,
): ValidatorCount {
  return {
    active: response.activeTotal.aggregate?.count ?? 0,
    total: response.total.aggregate?.count ?? 0,
  };
}

function mapMessages(messages: unknown): TransactionDetail["messages"] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.map((message) => {
    const type =
      message && typeof message === "object"
        ? toStringValue(
            (message as { ["@type"]?: unknown })["@type"],
            "Unknown",
          )
        : "Unknown";

    return {
      type: formatMessageType(type),
      value: message,
    };
  });
}

function mapTokenAmount(value: unknown, denom: string): TokenAmount | null {
  if (value == null) {
    return null;
  }

  return {
    amount: String(value),
    denom,
  };
}

function normalizeCoins(
  coins: unknown,
): Array<{ denom: string; amount: string }> {
  if (!Array.isArray(coins)) {
    return [];
  }

  return coins.flatMap((coin) => {
    if (!coin || typeof coin !== "object") {
      return [];
    }

    const denom = toStringValue((coin as { denom?: unknown }).denom);
    const amount = String((coin as { amount?: unknown }).amount ?? "");

    if (!denom || !amount) {
      return [];
    }

    return [{ denom, amount }];
  });
}

export function mapCoinList(coins: unknown): TokenAmount[] {
  return normalizeCoins(coins);
}

function getPrimaryCoinAmount(
  coins: unknown,
  denom: string,
): TokenAmount | null {
  const coin = normalizeCoins(coins).find((item) => item.denom === denom);

  if (!coin) {
    return null;
  }

  return {
    amount: coin.amount,
    denom: coin.denom,
  };
}

function mapValidatorStatus(
  status: number,
  jailed: boolean,
): Validator["status"] {
  if (jailed) {
    return "jailed";
  }

  if (status === 3) {
    return "active";
  }

  if (status > 0) {
    return "inactive";
  }

  return "unknown";
}

export type RawValidatorSet = Omit<ValidatorSet, 'items'> & { items: RawValidator[] };

export function mapValidatorSet(
  response: ValidatorsResponse,
  denom: string,
): RawValidatorSet {
  const items = response.validator
    .filter((row) => row.validatorInfo?.operatorAddress)
    .map((row) => {
      const votingPower =
        toOptionalNumber(row.validatorVotingPowers[0]?.votingPower) ?? 0;
      const commission = toOptionalNumber(
        row.validatorCommissions[0]?.commission,
      );
      const statusRow = row.validatorStatuses[0];
      const signingInfo = row.validatorSigningInfos[0];

      return {
        address: row.validatorInfo?.operatorAddress ?? "",
        moniker:
          row.validatorDescriptions[0]?.moniker ??
          row.validatorInfo?.operatorAddress ??
          "",
        avatarUrl: null,
        _identity: row.validatorDescriptions[0]?.identity ?? null,
        status: mapValidatorStatus(
          statusRow?.status ?? 0,
          toBoolean(statusRow?.jailed),
        ),
        jailed: toBoolean(statusRow?.jailed),
        tombstoned: toBoolean(signingInfo?.tombstoned),
        votingPower,
        votingPowerPercent: 0,
        commission,
        missedBlocksCounter: toNumber(signingInfo?.missedBlocksCounter),
      };
    })
    .sort((left, right) => right.votingPower - left.votingPower);

  const totalVotingPower = items.reduce(
    (sum, item) => sum + item.votingPower,
    0,
  );
  const itemsWithPercent = items.map((item) => ({
    ...item,
    votingPowerPercent:
      totalVotingPower === 0 ? 0 : (item.votingPower / totalVotingPower) * 100,
  }));

  const active = itemsWithPercent.filter(
    (item) => item.status === "active",
  ).length;
  const total = itemsWithPercent.length;
  const commissionItems = itemsWithPercent
    .map((item) => item.commission)
    .filter((item): item is number => item != null);
  const averageCommission =
    commissionItems.length === 0
      ? null
      : commissionItems.reduce((sum, value) => sum + value, 0) /
        commissionItems.length;

  return {
    items: itemsWithPercent,
    count: {
      active,
      total,
    },
    bonded: mapTokenAmount(response.stakingPool[0]?.bondedTokens, denom),
    averageCommission,
  };
}

export type RawValidatorDetail = ValidatorDetail & { _identity: string | null };

export function mapValidatorDetail(
  response: ValidatorDetailsResponse,
  validatorSet: RawValidatorSet,
): RawValidatorDetail | null {
  const detailRow = response.validator[0];

  if (!detailRow?.validatorInfo?.operatorAddress) {
    return null;
  }

  const found = validatorSet.items.find(
    (item) => item.address === detailRow.validatorInfo?.operatorAddress,
  );
  const base = found ?? {
    address: detailRow.validatorInfo.operatorAddress,
    moniker:
      detailRow.validatorDescriptions[0]?.moniker ??
      detailRow.validatorInfo.operatorAddress,
    avatarUrl: null,
    _identity: detailRow.validatorDescriptions[0]?.identity ?? null,
    status: mapValidatorStatus(
      detailRow.validatorStatuses[0]?.status ?? 0,
      toBoolean(detailRow.validatorStatuses[0]?.jailed),
    ),
    jailed: toBoolean(detailRow.validatorStatuses[0]?.jailed),
    tombstoned: toBoolean(detailRow.validatorSigningInfos[0]?.tombstoned),
    votingPower:
      toOptionalNumber(detailRow.validatorVotingPowers[0]?.votingPower) ?? 0,
    votingPowerPercent: 0,
    commission: toOptionalNumber(detailRow.validatorCommissions[0]?.commission),
    missedBlocksCounter: toNumber(
      detailRow.validatorSigningInfos[0]?.missedBlocksCounter,
    ),
  };

  return {
    ...base,
    selfDelegateAddress: detailRow.validatorInfo.selfDelegateAddress ?? "",
    maxRate: toOptionalNumber(detailRow.validatorInfo.maxRate),
    website: detailRow.validatorDescriptions[0]?.website ?? null,
    details: detailRow.validatorDescriptions[0]?.details ?? null,
    latestStatusHeight: toOptionalNumber(
      detailRow.validatorStatuses[0]?.height,
    ),
    recentBlocks: response.blocks.map((block) => ({
      height: toNumber(block.height),
      txs: block.txs ?? 0,
      hash: block.hash,
      timestamp: toStringValue(block.timestamp),
    })),
  };
}

export function mapAverageBlockTime(
  response: AverageBlockTimeResponse,
): number | null {
  const row = response.averageBlockTime[0];
  if (!row) {
    return null;
  }

  return toOptionalNumber(row.averageTime);
}

export function mapPrimaryCoin(
  coins: unknown,
  denom: string,
): TokenAmount | null {
  return getPrimaryCoinAmount(coins, denom);
}

function mapProposalStatus(value: string | null | undefined): ProposalStatus {
  switch (value) {
    case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
      return "deposit";
    case "PROPOSAL_STATUS_VOTING_PERIOD":
      return "voting";
    case "PROPOSAL_STATUS_PASSED":
      return "passed";
    case "PROPOSAL_STATUS_REJECTED":
      return "rejected";
    case "PROPOSAL_STATUS_FAILED":
      return "failed";
    default:
      return "unknown";
  }
}

function mapProposalType(content: unknown): string {
  if (!Array.isArray(content) || content.length === 0) {
    return "Unknown";
  }

  const first = content[0];
  if (!first || typeof first !== "object") {
    return "Unknown";
  }

  return formatMessageType(
    toStringValue((first as { ["@type"]?: unknown })["@type"], "Unknown"),
  );
}

function mapProposalSummaryRow(
  proposal: ProposalsResponse["proposals"][number],
): ProposalSummary {
  return {
    id: proposal.proposalId,
    title: proposal.title ?? "",
    description: proposal.description ?? "",
    proposer: proposal.proposer ?? "",
    status: mapProposalStatus(proposal.status),
    type: mapProposalType(proposal.content),
    submitTime: proposal.submitTime ?? null,
    votingEndTime: proposal.votingEndTime ?? null,
  };
}

export function mapProposals(response: ProposalsResponse): ProposalSummary[] {
  return response.proposals.map(mapProposalSummaryRow);
}

export function mapProposalDetail(
  response: ProposalDetailsResponse,
  denom: string,
): ProposalDetail | null {
  const proposal = response.proposal[0];
  if (!proposal) {
    return null;
  }

  const tallyRow = response.proposalTallyResult[0];
  const bondedTokens = response.stakingPool[0]?.bondedTokens;

  return {
    id: proposal.proposalId,
    title: proposal.title ?? "",
    description: proposal.description ?? "",
    proposer: proposal.proposer ?? "",
    status: mapProposalStatus(proposal.status),
    type: mapProposalType(proposal.content),
    submitTime: proposal.submitTime ?? null,
    votingEndTime: proposal.votingEndTime ?? null,
    metadata: proposal.metadata ?? null,
    content: proposal.content ?? null,
    depositEndTime: proposal.depositEndTime ?? null,
    votingStartTime: proposal.votingStartTime ?? null,
    tally: tallyRow
      ? {
          yes: String(tallyRow.yes ?? "0"),
          no: String(tallyRow.no ?? "0"),
          abstain: String(tallyRow.abstain ?? "0"),
          noWithVeto: String(tallyRow.noWithVeto ?? "0"),
          bondedTokens:
            bondedTokens == null
              ? null
              : { amount: String(bondedTokens), denom },
        }
      : null,
  };
}

export function mapAccountRewards(
  response: AccountRewardsResponse,
  primaryDenom: string,
): AccountReward[] {
  return response.delegationRewards.map((reward) => ({
    validatorAddress: reward.validatorAddress ?? "",
    amount: getPrimaryCoinAmount(reward.coins, primaryDenom),
  }));
}

export function mapAccountDelegations(
  response: AccountDelegationsResponse,
  primaryDenom: string,
): AccountDelegation[] {
  const items = response.delegations?.delegations ?? [];

  return items.map((delegation) => ({
    validatorAddress: delegation.validator_address ?? "",
    amount: getPrimaryCoinAmount(delegation.coins, primaryDenom),
  }));
}

export function mapAccountTransactions(
  response: AccountMessagesResponse,
): TransactionSummary[] {
  return response.messagesByAddress.flatMap((message) => {
    const transaction = message.transaction;
    if (!transaction) {
      return [];
    }

    return [
      {
        hash: transaction.hash,
        height: toNumber(transaction.height),
        type: getPrimaryMessageType(transaction.messages),
        success: transaction.success,
        timestamp: toStringValue(transaction.block.timestamp),
        messageCount: getMessageTypes(transaction.messages).length,
      },
    ];
  });
}

export function mapWithdrawalAddress(
  response: AccountWithdrawalAddressResponse,
): string | null {
  return response.withdrawalAddress?.address ?? null;
}

export function buildAccountOverview(params: {
  address: string;
  balances: unknown;
  delegationBalance: unknown;
  unbondingBalance: unknown;
  rewards: AccountReward[];
  delegations: AccountDelegation[];
  withdrawalAddress: string | null;
  transactions: TransactionSummary[];
  primaryDenom: string;
}): AccountOverview {
  return {
    address: params.address,
    balances: mapCoinList(params.balances),
    delegationBalance: getPrimaryCoinAmount(
      params.delegationBalance,
      params.primaryDenom,
    ),
    unbondingBalance: getPrimaryCoinAmount(
      params.unbondingBalance,
      params.primaryDenom,
    ),
    rewards: params.rewards,
    delegations: params.delegations,
    withdrawalAddress: params.withdrawalAddress,
    transactions: params.transactions,
  };
}
