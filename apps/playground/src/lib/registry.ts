export interface ComponentEntry {
  name: string;
  slug: string;
  description: string;
}

export interface RegistryCategory {
  name: string;
  items: ComponentEntry[];
}

export const registry: RegistryCategory[] = [
  {
    name: "Common",
    items: [
      {
        name: "Avatar",
        slug: "avatar",
        description:
          "An image element with a fallback for representing the user.",
      },
      {
        name: "Badge",
        slug: "badge",
        description: "Displays a badge or a component that looks like a badge.",
      },
      {
        name: "Button",
        slug: "button",
        description:
          "Displays a button or a component that looks like a button.",
      },
      {
        name: "Card",
        slug: "card",
        description: "Displays a card with header, content, and footer.",
      },
      {
        name: "Chart",
        slug: "chart",
        description: "Beautiful charts built with Recharts.",
      },
      {
        name: "Copy Button",
        slug: "copy-button",
        description: "Copies text to the clipboard with tooltip feedback.",
      },
      {
        name: "Dialog",
        slug: "dialog",
        description: "A modal dialog that interrupts the user.",
      },
      {
        name: "Dropdown Menu",
        slug: "dropdown-menu",
        description: "Displays a menu triggered from a button.",
      },
      {
        name: "Input",
        slug: "input",
        description: "Displays a form input field.",
      },
      {
        name: "Pagination",
        slug: "pagination",
        description:
          "Page navigation with previous/next arrows and page numbers.",
      },
      {
        name: "Popover",
        slug: "popover",
        description:
          "Displays rich content in a portal, triggered by a button.",
      },
      {
        name: "Scroll Area",
        slug: "scroll-area",
        description:
          "Augments native scroll functionality with custom styling.",
      },
      {
        name: "Select",
        slug: "select",
        description: "Displays a list of options for the user to pick from.",
      },
      {
        name: "Separator",
        slug: "separator",
        description: "Visually or semantically separates content.",
      },
      {
        name: "Sheet",
        slug: "sheet",
        description:
          "Extends Dialog to display content that complements the page.",
      },
      {
        name: "Skeleton",
        slug: "skeleton",
        description: "Used to show a placeholder while content is loading.",
      },
      {
        name: "Status Badge",
        slug: "status-badge",
        description:
          "Color-coded badge for transaction and validator statuses.",
      },
      {
        name: "Relative Time",
        slug: "relative-time",
        description: "Live-updating relative timestamp display.",
      },
      {
        name: "Table",
        slug: "table",
        description: "A responsive table component.",
      },
      {
        name: "Tabs",
        slug: "tabs",
        description: "A set of layered sections of content.",
      },
      {
        name: "Tooltip",
        slug: "tooltip",
        description: "A popup that displays information on hover.",
      },
    ],
  },
  {
    name: "Blocks",
    items: [
      {
        name: "Blocks Table",
        slug: "blocks-table",
        description: "Latest blocks with height, proposer, hash, and time.",
      },
    ],
  },
  {
    name: "Transactions",
    items: [
      {
        name: "Transactions Table",
        slug: "transactions-table",
        description: "Latest transactions with hash, type, status, and time.",
      },
    ],
  },
  {
    name: "Validators",
    items: [
      {
        name: "Validators Table",
        slug: "validators-table",
        description: "Validator set with status, voting power, and commission.",
      },
    ],
  },
  {
    name: "Accounts",
    items: [
      {
        name: "Account Balances",
        slug: "account-balances",
        description: "Token balances for an account.",
      },
      {
        name: "Account Delegations",
        slug: "account-delegations",
        description: "Staking delegations with pending rewards.",
      },
    ],
  },
  {
    name: "Proposals",
    items: [
      {
        name: "Proposals Table",
        slug: "proposals-table",
        description: "Governance proposals with status and voting period.",
      },
      {
        name: "Proposal Content",
        slug: "proposal-content",
        description: "Type-specific proposal content variants with composable building blocks.",
      },
      {
        name: "Timeline",
        slug: "timeline",
        description: "Vertical timeline for proposal lifecycle phases.",
      },
    ],
  },
];
