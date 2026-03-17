import { type Block, type TransactionSummary, type ValidatorCount } from '@cosmos-explorer/core';

import type {
  AverageBlockTimeResponse,
  LatestBlocksResponse,
  LatestTransactionsResponse,
  ValidatorCountResponse,
} from './home-types.js';

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toOptionalNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getMessageTypes(messages: unknown): string[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message) => {
      if (!message || typeof message !== 'object') {
        return '';
      }

      const type = (message as { ['@type']?: unknown })['@type'];
      return typeof type === 'string' ? type : '';
    })
    .filter(Boolean);
}

function summarizeMessageTypes(types: string[]): string {
  if (types.length === 0) {
    return 'Unknown';
  }

  const uniqueTypes = Array.from(new Set(types));

  if (uniqueTypes.length === 1) {
    return formatMessageType(uniqueTypes[0]);
  }

  return `${uniqueTypes.length} message types`;
}

function formatMessageType(type: string): string {
  const shortType = type.split('.').pop()?.split('/').pop() ?? type;
  return shortType.replace(/^Msg/, '') || 'Unknown';
}

export function mapBlocks(response: LatestBlocksResponse): Block[] {
  return response.blocks.map((block) => ({
    height: toNumber(block.height),
    txs: block.txs ?? 0,
    hash: block.hash,
    timestamp: toStringValue(block.timestamp),
    proposer: block.validator?.validatorInfo?.operatorAddress ?? '',
  }));
}

export function mapTransactions(response: LatestTransactionsResponse): TransactionSummary[] {
  return response.transactions.map((transaction) => {
    const types = getMessageTypes(transaction.messages);

    return {
      hash: transaction.hash,
      height: toNumber(transaction.height),
      type: summarizeMessageTypes(types),
      success: transaction.success,
      timestamp: toStringValue(transaction.block.timestamp),
      messageCount: types.length,
    };
  });
}

export function mapValidatorCount(response: ValidatorCountResponse): ValidatorCount {
  return {
    active: response.activeTotal.aggregate?.count ?? 0,
    total: response.total.aggregate?.count ?? 0,
  };
}

export function mapAverageBlockTime(response: AverageBlockTimeResponse): number | null {
  const row = response.averageBlockTime[0];
  if (!row) {
    return null;
  }

  return toOptionalNumber(row.averageTime);
}
