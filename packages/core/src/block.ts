export type Block = {
  height: number;
  hash: string;
  txs: number;
  timestamp: string;
  proposer: string;
};

export type BlockDetail = {
  overview: Block;
  signatures: string[];
};

export interface IBlockService {
  getLatestBlock(): Promise<Block | null>;
  getLatestBlocks(limit: number): Promise<Block[]>;
}
