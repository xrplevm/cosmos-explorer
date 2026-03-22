"use client";

import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "@cosmos-explorer/ui/timeline";
import { ComponentPreview } from "@/components/component-preview";
import { Check, Clock, Vote, Coins } from "lucide-react";

export default function TimelinePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vertical timeline component for displaying sequential events.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Proposal Lifecycle</h2>
        <ComponentPreview>
          <Timeline>
            <TimelineItem completed>
              <TimelineDot icon={<Check className="h-3 w-3" />} />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Submitted</TimelineTitle>
                <TimelineDescription>19/02/2026, 18:53:18</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem completed>
              <TimelineDot icon={<Coins className="h-3 w-3" />} />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Deposit Period</TimelineTitle>
                <TimelineDescription>21/02/2026, 18:53:18</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem active>
              <TimelineDot icon={<Vote className="h-3 w-3" />} />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Voting Period</TimelineTitle>
                <TimelineDescription>19/02/2026, 18:53:18</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot icon={<Clock className="h-3 w-3" />} />
              <TimelineContent>
                <TimelineTitle>Result</TimelineTitle>
                <TimelineDescription>Pending</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">All Completed</h2>
        <ComponentPreview>
          <Timeline>
            <TimelineItem completed>
              <TimelineDot icon={<Check className="h-3 w-3" />} />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Submitted</TimelineTitle>
                <TimelineDescription>10/01/2026, 14:00:00</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem completed>
              <TimelineDot icon={<Coins className="h-3 w-3" />} />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Deposit Period</TimelineTitle>
                <TimelineDescription>12/01/2026, 14:00:00</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem completed>
              <TimelineDot icon={<Vote className="h-3 w-3" />} />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Voting Period</TimelineTitle>
                <TimelineDescription>12/01/2026, 14:00:00</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem active>
              <TimelineDot icon={<Check className="h-3 w-3" />} />
              <TimelineContent>
                <TimelineTitle>Passed</TimelineTitle>
                <TimelineDescription>24/01/2026, 14:00:00</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Deposit Phase (minimal)</h2>
        <ComponentPreview>
          <Timeline>
            <TimelineItem completed>
              <TimelineDot />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Submitted</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem active>
              <TimelineDot />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Deposit Period</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot />
              <TimelineConnector />
              <TimelineContent>
                <TimelineTitle>Voting Period</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot />
              <TimelineContent>
                <TimelineTitle>Result</TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </ComponentPreview>
      </section>
    </div>
  );
}
