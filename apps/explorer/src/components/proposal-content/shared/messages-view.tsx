import Link from "next/link";
import { cn } from "@cosmos-explorer/ui/lib/utils";
import { CopyButton } from "@cosmos-explorer/ui/copy-button";
import { type ContentMessage, shortType, getTypeColor } from "./message-helpers";

// ─── Shared message parts ────────────────────────────────────────────────────

function MessageBadge({ typeName }: { typeName: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        getTypeColor(typeName),
      )}
    >
      {typeName}
    </span>
  );
}

function MessageRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function AddressValue({ address, link }: { address: string; link?: boolean }) {
  const truncated = `${address.slice(0, 14)}…${address.slice(-8)}`;
  if (link) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Link
          href={`/account/${encodeURIComponent(address)}`}
          className="font-mono text-primary-soft hover:text-primary transition-colors"
        >
          {truncated}
        </Link>
        <CopyButton value={address} label="address" size="xs" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-mono text-muted-foreground">{truncated}</span>
      <CopyButton value={address} label="address" size="xs" />
    </span>
  );
}

function ValidatorChip({ moniker, colorClass }: { moniker: string; colorClass: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${colorClass}`}
      >
        {moniker.slice(0, 2).toUpperCase()}
      </span>
      <span className="font-medium text-sm">{moniker}</span>
    </span>
  );
}

function CoinValue({ coins }: { coins: { denom?: string; amount?: string }[] }) {
  return (
    <span className="font-mono">
      {coins.map((c, i) => (
        <span key={i}>
          {i > 0 && ", "}
          {c.amount ?? "0"} {c.denom ?? ""}
        </span>
      ))}
    </span>
  );
}

// ─── Message variant renderers ───────────────────────────────────────────────

function RemoveValidatorMessage({ msg }: { msg: ContentMessage }) {
  const moniker = msg.moniker ?? msg.description?.moniker;
  const address = msg.validator_address ?? msg.validatorAddress;
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Remove validator</span>
      {moniker && (
        <MessageRow label="Validator">
          <ValidatorChip moniker={moniker} colorClass="bg-red-500/15 text-red-400" />
        </MessageRow>
      )}
      {address && (
        <MessageRow label="Address">
          <AddressValue address={address} link />
        </MessageRow>
      )}
      {(msg.authority ?? msg.sender) && (
        <MessageRow label="Authority">
          <AddressValue address={(msg.authority ?? msg.sender)!} link />
        </MessageRow>
      )}
    </div>
  );
}

function AddValidatorMessage({ msg }: { msg: ContentMessage }) {
  const moniker = msg.moniker ?? msg.description?.moniker;
  const address = msg.validator_address ?? msg.validatorAddress;
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Add validator</span>
      {moniker && (
        <MessageRow label="Validator">
          <ValidatorChip moniker={moniker} colorClass="bg-green-500/15 text-green-400" />
        </MessageRow>
      )}
      {address && (
        <MessageRow label="Address">
          <AddressValue address={address} link />
        </MessageRow>
      )}
      {(msg.authority ?? msg.sender) && (
        <MessageRow label="Authority">
          <AddressValue address={(msg.authority ?? msg.sender)!} link />
        </MessageRow>
      )}
    </div>
  );
}

function SoftwareUpgradeMessage({ msg }: { msg: ContentMessage }) {
  const plan = msg.plan;
  return (
    <div className="space-y-1.5">
      <span className="text-sm">
        Software upgrade{plan?.name ? ` to ${plan.name}` : ""}
      </span>
      {plan?.name && <MessageRow label="Name"><span>{plan.name}</span></MessageRow>}
      {plan?.height && (
        <MessageRow label="Height">
          <span className="font-mono">{Number(plan.height).toLocaleString()}</span>
        </MessageRow>
      )}
      {msg.authority && (
        <MessageRow label="Authority">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
    </div>
  );
}

function CancelUpgradeMessage({ msg }: { msg: ContentMessage }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Cancel software upgrade</span>
      {msg.authority && (
        <MessageRow label="Authority">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
    </div>
  );
}

function CommunityPoolSpendMessage({ msg }: { msg: ContentMessage }) {
  const recipient = msg.recipient as string | undefined;
  const coins = Array.isArray(msg.amount) ? msg.amount as { denom?: string; amount?: string }[] : undefined;
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Community pool spend</span>
      {recipient && (
        <MessageRow label="Recipient">
          <AddressValue address={recipient} link />
        </MessageRow>
      )}
      {coins && coins.length > 0 && (
        <MessageRow label="Amount">
          <CoinValue coins={coins} />
        </MessageRow>
      )}
      {msg.authority && (
        <MessageRow label="Authority">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
    </div>
  );
}

function UpdateParamsMessage({ msg }: { msg: ContentMessage }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Update parameters</span>
      {msg.authority && (
        <MessageRow label="Authority">
          <AddressValue address={msg.authority} link />
        </MessageRow>
      )}
    </div>
  );
}

function TextMessage() {
  return (
    <div className="space-y-1.5">
      <span className="text-sm">Text proposal</span>
    </div>
  );
}

function DefaultMessage({ msg }: { msg: ContentMessage }) {
  const address = msg.authority ?? msg.sender ?? msg.validator_address ?? msg.validatorAddress;
  return (
    <div className="space-y-1.5">
      {address && (
        <MessageRow label="Address">
          <AddressValue address={address} link />
        </MessageRow>
      )}
    </div>
  );
}

// ─── Message variant registry ────────────────────────────────────────────────

function getMessageRenderer(typeName: string): React.FC<{ msg: ContentMessage }> {
  if (typeName.includes("RemoveValidator")) return RemoveValidatorMessage;
  if (typeName.includes("AddValidator")) return AddValidatorMessage;
  if (typeName.includes("SoftwareUpgrade") && !typeName.includes("Cancel")) return SoftwareUpgradeMessage;
  if (typeName.includes("Cancel") && typeName.includes("Upgrade")) return CancelUpgradeMessage;
  if (typeName.includes("CommunityPoolSpend")) return CommunityPoolSpendMessage;
  if (typeName.includes("UpdateParams") || typeName.includes("ParameterChange")) return UpdateParamsMessage;
  if (typeName.includes("Text")) return TextMessage;
  return DefaultMessage;
}

// ─── MessagesView ────────────────────────────────────────────────────────────

export function MessagesView({ messages }: { messages: ContentMessage[] }) {
  if (messages.length === 0) {
    return <p className="py-4 text-center text-sm text-muted-foreground">No messages.</p>;
  }

  return (
    <div className="space-y-2">
      {messages.map((msg, i) => {
        const fullType = msg["@type"] ?? "Unknown";
        const typeName = shortType(fullType);
        const Renderer = getMessageRenderer(typeName);

        return (
          <div
            key={i}
            className="rounded-lg border border-border bg-muted/20 px-3 py-2.5"
          >
            <div className="flex items-start gap-3">
              <MessageBadge typeName={typeName} />
              <div className="min-w-0 flex-1">
                <Renderer msg={msg} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
