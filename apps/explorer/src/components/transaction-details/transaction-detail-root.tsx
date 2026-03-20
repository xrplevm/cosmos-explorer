import type { TransactionDetailViewProps } from "./types";
import { getPrimaryMessageType } from "./types";
import { DefaultTransactionDetail } from "./variants/default";
import { EthereumTransactionDetail } from "./variants/ethereum";
// Cosmos SDK - staking
import { DelegateTransactionDetail } from "./variants/delegate";
import { UndelegateTransactionDetail } from "./variants/undelegate";
import { BeginRedelegateTransactionDetail } from "./variants/begin-redelegate";
import { CreateValidatorTransactionDetail } from "./variants/create-validator";
import { EditValidatorTransactionDetail } from "./variants/edit-validator";
// Cosmos SDK - bank
import { SendTransactionDetail } from "./variants/send";
import { MultiSendTransactionDetail } from "./variants/multi-send";
// Cosmos SDK - crisis
import { VerifyInvariantTransactionDetail } from "./variants/verify-invariant";
// Cosmos SDK - slashing
import { UnjailTransactionDetail } from "./variants/unjail";
// Cosmos SDK - distribution
import { FundCommunityPoolTransactionDetail } from "./variants/fund-community-pool";
import { SetWithdrawAddressTransactionDetail } from "./variants/set-withdraw-address";
import { WithdrawDelegatorRewardTransactionDetail } from "./variants/withdraw-delegator-reward";
import { WithdrawValidatorCommissionTransactionDetail } from "./variants/withdraw-validator-commission";
// Cosmos SDK - governance
import { VoteTransactionDetail } from "./variants/vote";
import { SubmitProposalTransactionDetail } from "./variants/submit-proposal";
import { DepositTransactionDetail } from "./variants/deposit";
// Cosmos SDK - authz
import { ExecTransactionDetail } from "./variants/exec";
import { GrantTransactionDetail } from "./variants/grant";
import { RevokeTransactionDetail } from "./variants/revoke";
// Cosmos SDK - feegrant
import { GrantAllowanceTransactionDetail } from "./variants/grant-allowance";
import { RevokeAllowanceTransactionDetail } from "./variants/revoke-allowance";
// Cosmos SDK - vesting
import { CreateVestingAccountTransactionDetail } from "./variants/create-vesting-account";
import { CreatePeriodicVestingAccountTransactionDetail } from "./variants/create-periodic-vesting-account";
// IBC - client
import { CreateClientTransactionDetail } from "./variants/create-client";
import { UpdateClientTransactionDetail } from "./variants/update-client";
import { UpgradeClientTransactionDetail } from "./variants/upgrade-client";
import { SubmitMisbehaviourTransactionDetail } from "./variants/submit-misbehaviour";
// IBC - channel
import { RecvPacketTransactionDetail } from "./variants/recv-packet";
import { AcknowledgementTransactionDetail } from "./variants/acknowledgement";
import { ChannelCloseConfirmTransactionDetail } from "./variants/channel-close-confirm";
import { ChannelCloseInitTransactionDetail } from "./variants/channel-close-init";
import { ChannelOpenAckTransactionDetail } from "./variants/channel-open-ack";
import { ChannelOpenConfirmTransactionDetail } from "./variants/channel-open-confirm";
import { ChannelOpenInitTransactionDetail } from "./variants/channel-open-init";
import { ChannelOpenTryTransactionDetail } from "./variants/channel-open-try";
import { TimeoutTransactionDetail } from "./variants/timeout";
import { TimeoutOnCloseTransactionDetail } from "./variants/timeout-on-close";
// IBC - connection
import { ConnectionOpenAckTransactionDetail } from "./variants/connection-open-ack";
import { ConnectionOpenConfirmTransactionDetail } from "./variants/connection-open-confirm";
import { ConnectionOpenInitTransactionDetail } from "./variants/connection-open-init";
import { ConnectionOpenTryTransactionDetail } from "./variants/connection-open-try";
// IBC - transfer
import { TransferTransactionDetail } from "./variants/transfer";
// Custom
import { SoftwareUpgradeTransactionDetail } from "./variants/software-upgrade";
import { RemoveValidatorTransactionDetail } from "./variants/remove-validator";
import { AddValidatorTransactionDetail } from "./variants/add-validator";
import { UpdateParamsTransactionDetail } from "./variants/update-params";

/**
 * Dispatches to a type-specific detail view. Add a `case` and import from `./variants/<type>`.
 */
export function TransactionDetailRoot(props: TransactionDetailViewProps) {
  const type = getPrimaryMessageType(props.transaction);

  switch (type) {
    // EVM
    case "EthereumTx":
      return <EthereumTransactionDetail {...props} />;
    // Staking
    case "Delegate":
      return <DelegateTransactionDetail {...props} />;
    case "Undelegate":
      return <UndelegateTransactionDetail {...props} />;
    case "BeginRedelegate":
      return <BeginRedelegateTransactionDetail {...props} />;
    case "CreateValidator":
      return <CreateValidatorTransactionDetail {...props} />;
    case "EditValidator":
      return <EditValidatorTransactionDetail {...props} />;
    // Bank
    case "Send":
      return <SendTransactionDetail {...props} />;
    case "MultiSend":
      return <MultiSendTransactionDetail {...props} />;
    // Crisis
    case "VerifyInvariant":
      return <VerifyInvariantTransactionDetail {...props} />;
    // Slashing
    case "Unjail":
      return <UnjailTransactionDetail {...props} />;
    // Distribution
    case "FundCommunityPool":
      return <FundCommunityPoolTransactionDetail {...props} />;
    case "SetWithdrawAddress":
      return <SetWithdrawAddressTransactionDetail {...props} />;
    case "WithdrawDelegatorReward":
      return <WithdrawDelegatorRewardTransactionDetail {...props} />;
    case "WithdrawValidatorCommission":
      return <WithdrawValidatorCommissionTransactionDetail {...props} />;
    // Governance
    case "Vote":
      return <VoteTransactionDetail {...props} />;
    case "SubmitProposal":
      return <SubmitProposalTransactionDetail {...props} />;
    case "Deposit":
      return <DepositTransactionDetail {...props} />;
    // Authz
    case "Exec":
      return <ExecTransactionDetail {...props} />;
    case "Grant":
      return <GrantTransactionDetail {...props} />;
    case "Revoke":
      return <RevokeTransactionDetail {...props} />;
    // Feegrant
    case "GrantAllowance":
      return <GrantAllowanceTransactionDetail {...props} />;
    case "RevokeAllowance":
      return <RevokeAllowanceTransactionDetail {...props} />;
    // Vesting
    case "CreateVestingAccount":
      return <CreateVestingAccountTransactionDetail {...props} />;
    case "CreatePeriodicVestingAccount":
      return <CreatePeriodicVestingAccountTransactionDetail {...props} />;
    // IBC Client
    case "CreateClient":
      return <CreateClientTransactionDetail {...props} />;
    case "UpdateClient":
      return <UpdateClientTransactionDetail {...props} />;
    case "UpgradeClient":
      return <UpgradeClientTransactionDetail {...props} />;
    case "SubmitMisbehaviour":
      return <SubmitMisbehaviourTransactionDetail {...props} />;
    // IBC Channel
    case "RecvPacket":
      return <RecvPacketTransactionDetail {...props} />;
    case "Acknowledgement":
      return <AcknowledgementTransactionDetail {...props} />;
    case "ChannelCloseConfirm":
      return <ChannelCloseConfirmTransactionDetail {...props} />;
    case "ChannelCloseInit":
      return <ChannelCloseInitTransactionDetail {...props} />;
    case "ChannelOpenAck":
      return <ChannelOpenAckTransactionDetail {...props} />;
    case "ChannelOpenConfirm":
      return <ChannelOpenConfirmTransactionDetail {...props} />;
    case "ChannelOpenInit":
      return <ChannelOpenInitTransactionDetail {...props} />;
    case "ChannelOpenTry":
      return <ChannelOpenTryTransactionDetail {...props} />;
    case "Timeout":
      return <TimeoutTransactionDetail {...props} />;
    case "TimeoutOnClose":
      return <TimeoutOnCloseTransactionDetail {...props} />;
    // IBC Connection
    case "ConnectionOpenAck":
      return <ConnectionOpenAckTransactionDetail {...props} />;
    case "ConnectionOpenConfirm":
      return <ConnectionOpenConfirmTransactionDetail {...props} />;
    case "ConnectionOpenInit":
      return <ConnectionOpenInitTransactionDetail {...props} />;
    case "ConnectionOpenTry":
      return <ConnectionOpenTryTransactionDetail {...props} />;
    // IBC Transfer
    case "Transfer":
      return <TransferTransactionDetail {...props} />;
    // Custom
    case "SoftwareUpgrade":
      return <SoftwareUpgradeTransactionDetail {...props} />;
    case "RemoveValidator":
      return <RemoveValidatorTransactionDetail {...props} />;
    case "AddValidator":
      return <AddValidatorTransactionDetail {...props} />;
    case "UpdateParams":
      return <UpdateParamsTransactionDetail {...props} />;
    default:
      return <DefaultTransactionDetail {...props} />;
  }
}
