import {
  IconCircleCheckFilled,
  IconCircleFilled,
  IconCircleXFilled,
  IconGavel,
} from "@tabler/icons-react";
import type { ValidatorStatus } from "@cosmos-explorer/core";

export type ValidatorStatusFilter = ValidatorStatus | "all";

export interface ValidatorStatusFilterOption {
  value: ValidatorStatusFilter;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const VALIDATOR_STATUS_FILTERS: ValidatorStatusFilterOption[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active", icon: IconCircleCheckFilled },
  { value: "inactive", label: "Inactive", icon: IconCircleFilled },
  { value: "jailed", label: "Jailed", icon: IconGavel },
  { value: "removed", label: "Removed", icon: IconCircleXFilled },
];
