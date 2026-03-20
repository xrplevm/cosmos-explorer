import type { TransactionDetailViewProps } from "./types";
import { getPrimaryMessageType } from "./types";
import { DefaultTransactionDetail } from "./messages/default";
import { EthereumTransactionDetail } from "./messages/ethereum";
// Cosmos SDK - staking
import { DelegateTransactionDetail } from "./messages/delegate";
import { UndelegateTransactionDetail } from "./messages/undelegate";
import { BeginRedelegateTransactionDetail } from "./messages/begin-redelegate";
import { CreateValidatorTransactionDetail } from "./messages/create-validator";
import { EditValidatorTransactionDetail } from "./messages/edit-validator";
// Cosmos SDK - bank
import { SendTransactionDetail } from "./messages/send";
import { MultiSendTransactionDetail } from "./messages/multi-send";
// Cosmos SDK - crisis
import { VerifyInvariantTransactionDetail } from "./messages/verify-invariant";
// Cosmos SDK - slashing
import { UnjailTransactionDetail } from "./messages/unjail";
// Cosmos SDK - distribution
import { FundCommunityPoolTransactionDetail } from "./messages/fund-community-pool";
import { SetWithdrawAddressTransactionDetail } from "./messages/set-withdraw-address";
import { WithdrawDelegatorRewardTransactionDetail } from "./messages/withdraw-delegator-reward";
import { WithdrawValidatorCommissionTransactionDetail } from "./messages/withdraw-validator-commission";
// Cosmos SDK - governance
import { VoteTransactionDetail } from "./messages/vote";
import { SubmitProposalTransactionDetail } from "./messages/submit-proposal";
import { DepositTransactionDetail } from "./messages/deposit";
// Cosmos SDK - authz
import { ExecTransactionDetail } from "./messages/exec";
import { GrantTransactionDetail } from "./messages/grant";
import { RevokeTransactionDetail } from "./messages/revoke";
// Cosmos SDK - feegrant
import { GrantAllowanceTransactionDetail } from "./messages/grant-allowance";
import { RevokeAllowanceTransactionDetail } from "./messages/revoke-allowance";
// Cosmos SDK - vesting
import { CreateVestingAccountTransactionDetail } from "./messages/create-vesting-account";
import { CreatePeriodicVestingAccountTransactionDetail } from "./messages/create-periodic-vesting-account";
// IBC - client
import { CreateClientTransactionDetail } from "./messages/create-client";
import { UpdateClientTransactionDetail } from "./messages/update-client";
import { UpgradeClientTransactionDetail } from "./messages/upgrade-client";
import { SubmitMisbehaviourTransactionDetail } from "./messages/submit-misbehaviour";
// IBC - channel
import { RecvPacketTransactionDetail } from "./messages/recv-packet";
import { AcknowledgementTransactionDetail } from "./messages/acknowledgement";
import { ChannelCloseConfirmTransactionDetail } from "./messages/channel-close-confirm";
import { ChannelCloseInitTransactionDetail } from "./messages/channel-close-init";
import { ChannelOpenAckTransactionDetail } from "./messages/channel-open-ack";
import { ChannelOpenConfirmTransactionDetail } from "./messages/channel-open-confirm";
import { ChannelOpenInitTransactionDetail } from "./messages/channel-open-init";
import { ChannelOpenTryTransactionDetail } from "./messages/channel-open-try";
import { TimeoutTransactionDetail } from "./messages/timeout";
import { TimeoutOnCloseTransactionDetail } from "./messages/timeout-on-close";
// IBC - connection
import { ConnectionOpenAckTransactionDetail } from "./messages/connection-open-ack";
import { ConnectionOpenConfirmTransactionDetail } from "./messages/connection-open-confirm";
import { ConnectionOpenInitTransactionDetail } from "./messages/connection-open-init";
import { ConnectionOpenTryTransactionDetail } from "./messages/connection-open-try";
// IBC - transfer
import { TransferTransactionDetail } from "./messages/transfer";
// Custom
import { SoftwareUpgradeTransactionDetail } from "./messages/software-upgrade";
import { RemoveValidatorTransactionDetail } from "./messages/remove-validator";
import { AddValidatorTransactionDetail } from "./messages/add-validator";
import { UpdateParamsTransactionDetail } from "./messages/update-params";

/**
 * Dispatches to a type-specific detail view. Add a `case` and import from `./messages/<type>`.
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
