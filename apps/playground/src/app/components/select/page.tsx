"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@cosmos-explorer/ui/select";
import { ComponentPreview } from "@/components/component-preview";

export default function SelectPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Select</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Displays a list of options for the user to pick from.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainnet">Mainnet</SelectItem>
              <SelectItem value="testnet">Testnet</SelectItem>
              <SelectItem value="devnet">Devnet</SelectItem>
            </SelectContent>
          </Select>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">With groups</h2>
        <ComponentPreview>
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cosmos SDK</SelectLabel>
                <SelectItem value="cosmos">Cosmos Hub</SelectItem>
                <SelectItem value="osmosis">Osmosis</SelectItem>
                <SelectItem value="juno">Juno</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>EVM Sidechains</SelectLabel>
                <SelectItem value="xrp-evm">XRP EVM</SelectItem>
                <SelectItem value="evmos">Evmos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ComponentPreview>
      </section>
    </div>
  );
}
