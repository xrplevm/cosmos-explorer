import { cache } from "react";
import { loadChainConfig } from "@cosmos-explorer/config";
import chainJson from "../../chain.json";

export const getChainConfig = cache(() => loadChainConfig(chainJson));
