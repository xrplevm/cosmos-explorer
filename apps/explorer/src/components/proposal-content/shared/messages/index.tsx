import type { ContentMessage } from "../message-helpers";
import { shortType } from "../message-helpers";
import { MessageBadge } from "./shared";
import { RemoveValidatorMessage } from "./remove-validator";
import { AddValidatorMessage } from "./add-validator";
import { SoftwareUpgradeMessage } from "./software-upgrade";
import { CancelUpgradeMessage } from "./cancel-upgrade";
import { CommunityPoolSpendMessage } from "./community-pool-spend";
import { UpdateParamsMessage } from "./update-params";
import { TextMessage } from "./text";
import { TransferOwnershipMessage } from "./transfer-ownership";
import { SendMessage } from "./send";
import { DefaultMessage } from "./default";

type MessageRenderer = React.FC<{ msg: ContentMessage }>;

const MESSAGE_REGISTRY: [test: (name: string) => boolean, component: MessageRenderer][] = [
  [(n) => n.includes("RemoveValidator"), RemoveValidatorMessage],
  [(n) => n.includes("AddValidator"), AddValidatorMessage],
  [(n) => n.includes("SoftwareUpgrade") && !n.includes("Cancel"), SoftwareUpgradeMessage],
  [(n) => n.includes("Cancel") && n.includes("Upgrade"), CancelUpgradeMessage],
  [(n) => n.includes("CommunityPoolSpend"), CommunityPoolSpendMessage],
  [(n) => n.includes("UpdateParams") || n.includes("ParameterChange"), UpdateParamsMessage],
  [(n) => n.includes("Text"), TextMessage],
  [(n) => n.includes("TransferOwnership"), TransferOwnershipMessage],
  [(n) => n.includes("Send") && !n.includes("Multi"), SendMessage],
];

function getMessageRenderer(typeName: string): MessageRenderer {
  for (const [test, component] of MESSAGE_REGISTRY) {
    if (test(typeName)) return component;
  }
  return DefaultMessage;
}

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
            className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5"
          >
            <MessageBadge typeName={typeName} />
            <div className="min-w-0 flex-1">
              <Renderer msg={msg} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
