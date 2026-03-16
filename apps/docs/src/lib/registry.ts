export interface ComponentEntry {
  name: string;
  slug: string;
  description: string;
}

export const registry: ComponentEntry[] = [
  {
    name: "Avatar",
    slug: "avatar",
    description: "An image element with a fallback for representing the user.",
  },
  {
    name: "Badge",
    slug: "badge",
    description: "Displays a badge or a component that looks like a badge.",
  },
  {
    name: "Button",
    slug: "button",
    description: "Displays a button or a component that looks like a button.",
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
    name: "Popover",
    slug: "popover",
    description: "Displays rich content in a portal, triggered by a button.",
  },
  {
    name: "Scroll Area",
    slug: "scroll-area",
    description: "Augments native scroll functionality with custom styling.",
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
    description: "Extends Dialog to display content that complements the page.",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "Used to show a placeholder while content is loading.",
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
];
