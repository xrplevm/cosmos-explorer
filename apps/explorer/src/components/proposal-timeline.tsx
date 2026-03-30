import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@cosmos-explorer/ui/timeline";
import { Timestamp } from "@/components/timestamp";
import { IconCheck as Check, IconClock as Clock, IconThumbUp as Vote, IconCoins as Coins } from "@tabler/icons-react";
import type { ProposalDetail, ProposalStatus } from "@cosmos-explorer/core";

type TimelinePhase = "submitted" | "deposit" | "voting" | "result";

function getActivePhase(status: ProposalStatus): TimelinePhase {
  switch (status) {
    case "deposit":
      return "deposit";
    case "voting":
      return "voting";
    case "passed":
    case "rejected":
    case "failed":
      return "result";
    default:
      return "submitted";
  }
}

const PHASE_ORDER: TimelinePhase[] = ["submitted", "deposit", "voting", "result"];

function toStatusLabel(status: ProposalStatus): string {
  switch (status) {
    case "deposit":
      return "Deposit";
    case "voting":
      return "Voting";
    case "passed":
      return "Passed";
    case "rejected":
    case "failed":
      return "Rejected";
    default:
      return "Unknown";
  }
}

export function ProposalTimeline({ proposal }: { proposal: ProposalDetail }) {
  const activePhase = getActivePhase(proposal.status);

  const phases: {
    phase: TimelinePhase;
    label: string;
    timestamp: string | null;
    icon: React.ReactNode;
  }[] = [
    {
      phase: "submitted",
      label: "Submitted",
      timestamp: proposal.submitTime,
      icon: <Check className="h-3 w-3" />,
    },
    {
      phase: "deposit",
      label: "Deposit Period",
      timestamp: proposal.depositEndTime,
      icon: <Coins className="h-3 w-3" />,
    },
    {
      phase: "voting",
      label: "Voting Period",
      timestamp: proposal.votingStartTime,
      icon: <Vote className="h-3 w-3" />,
    },
    {
      phase: "result",
      label: toStatusLabel(proposal.status),
      timestamp: proposal.votingEndTime,
      icon: <Clock className="h-3 w-3" />,
    },
  ];

  return (
    <Timeline>
      {phases.map((p, i) => {
        const completed = PHASE_ORDER.indexOf(p.phase) < PHASE_ORDER.indexOf(activePhase);
        const active = p.phase === activePhase;

        return (
          <TimelineItem key={p.phase} completed={completed} active={active}>
            <TimelineDot icon={p.icon} />
            {i < phases.length - 1 && <TimelineConnector />}
            <TimelineContent>
              <TimelineTitle>{p.label}</TimelineTitle>
              {p.timestamp != null && (
                <TimelineDescription>
                  <Timestamp value={p.timestamp} />
                </TimelineDescription>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
