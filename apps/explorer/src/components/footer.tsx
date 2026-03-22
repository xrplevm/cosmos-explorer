import { getChainConfig } from "@/lib/config";
import {
  Bug,
  MessageCircle,
  Code,
  Globe,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@cosmos-explorer/ui/separator";

interface FooterLinkDef {
  name: string;
  href: string;
  icon: LucideIcon;
}

const linkDefs: {
  key: "issues" | "github" | "discord" | "website";
  name: string;
  icon: LucideIcon;
}[] = [
  { key: "issues", name: "Submit an Issue", icon: Bug },
  { key: "github", name: "GitHub", icon: Code },
  { key: "discord", name: "Discord", icon: MessageCircle },
  { key: "website", name: "Website", icon: Globe },
];

function FooterLink({ link }: { link: FooterLinkDef }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <link.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{link.name}</span>
      <ExternalLink
        className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-50"
        aria-hidden="true"
      />
    </a>
  );
}

export function Footer() {
  const config = getChainConfig();

  const links = (config.links ?? {}) as Record<string, string | undefined>;
  const footerLinks: FooterLinkDef[] = [];
  for (const def of linkDefs) {
    const href = links[def.key];
    if (href != null) {
      footerLinks.push({ name: def.name, href, icon: def.icon });
    }
  }

  return (
    <footer className="border-t border-border bg-background px-4 py-10 md:px-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: branding + description */}
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">X</span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              {config.branding.title}
            </span>
          </div>
          {config.branding.description && (
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {config.branding.description}
            </p>
          )}
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>
              Chain ID:{" "}
              <span className="font-mono text-foreground/70">
                {config.network.chainId}
              </span>
            </p>
            <p>
              Network:{" "}
              <span className="capitalize text-foreground/70">
                {config.network.chainEnv}
              </span>
            </p>
          </div>
        </div>

        {/* Right: resource links in 2-col grid, vertically centered */}
        {footerLinks.length > 0 && (
          <nav aria-label="Footer resources" className="grid grid-cols-2 gap-x-16 gap-y-5">
            {footerLinks.map((link) => (
              <FooterLink key={link.name} link={link} />
            ))}
          </nav>
        )}
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built by{" "}
          {links.website ? (
            <a
              href={links.website}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Peersyst
            </a>
          ) : (
            <span className="font-medium text-foreground/70">Peersyst</span>
          )}
        </p>
        <p>
          &copy; {new Date().getFullYear()} {config.network.chainName}. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
