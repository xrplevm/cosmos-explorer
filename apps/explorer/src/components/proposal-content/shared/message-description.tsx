import { type ContentMessage, getMoniker, getValidatorAddress } from "./message-helpers";

function ValidatorChip({ moniker, colorClass }: { moniker: string; colorClass: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${colorClass}`}>
        {moniker.slice(0, 2).toUpperCase()}
      </span>
      <span className="font-medium">{moniker}</span>
    </span>
  );
}

export function MessageDescription({ msg, typeName }: { msg: ContentMessage; typeName: string }) {
  const moniker = getMoniker(msg);
  const address = getValidatorAddress(msg);

  if (typeName.includes("RemoveValidator")) {
    return (
      <span className="flex items-center gap-2">
        Remove
        {moniker && <ValidatorChip moniker={moniker} colorClass="bg-red-500/15 text-red-400" />}
        validator
      </span>
    );
  }
  if (typeName.includes("AddValidator")) {
    return (
      <span className="flex items-center gap-2">
        Add
        {moniker && <ValidatorChip moniker={moniker} colorClass="bg-green-500/15 text-green-400" />}
        validator
      </span>
    );
  }

  if (typeName.includes("SoftwareUpgrade") && !typeName.includes("Cancel")) {
    const name = msg.plan?.name;
    return <span>Software upgrade{name ? ` to ${name}` : ""}{msg.plan?.height ? ` at height ${Number(msg.plan.height).toLocaleString()}` : ""}</span>;
  }
  if (typeName.includes("Cancel") && typeName.includes("Upgrade")) {
    return <span>Cancel software upgrade</span>;
  }

  if (typeName.includes("CommunityPoolSpend")) {
    const recipient = msg.recipient as string | undefined;
    return (
      <span>
        Community pool spend
        {recipient ? <> to <span className="font-mono text-xs">{recipient.slice(0, 12)}…{recipient.slice(-6)}</span></> : ""}
      </span>
    );
  }

  if (typeName.includes("UpdateParams") || typeName.includes("ParameterChange")) {
    return <span>Update parameters</span>;
  }

  if (typeName.includes("Text")) {
    return <span>Text proposal</span>;
  }

  if (address) {
    return (
      <span className="font-mono text-xs text-muted-foreground">
        {address.slice(0, 16)}…{address.slice(-8)}
      </span>
    );
  }

  return <span className="text-muted-foreground">—</span>;
}
