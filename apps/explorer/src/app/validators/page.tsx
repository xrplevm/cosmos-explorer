import { Card, CardContent, CardHeader, CardTitle } from "@cosmos-explorer/ui/card";
import { ValidatorTable } from "@/components/validator-table";
import {
  formatPercent,
  formatTokenAmount,
} from "@/lib/formatters";
import { getServices } from "@/lib/services";
import { getChainConfig } from "@/lib/config";

export default async function ValidatorsPage() {
  const { validatorService } = getServices();
  const validatorSet = await validatorService.getValidatorSet();
  const { network: { primaryToken } } = getChainConfig();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Validators</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{validatorSet.count.active.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bonded</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatTokenAmount(validatorSet.bonded, primaryToken)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatPercent(
                validatorSet.averageCommission == null
                  ? null
                  : validatorSet.averageCommission * 100
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validator Set</CardTitle>
        </CardHeader>
        <CardContent>
          <ValidatorTable validators={validatorSet.items} />
        </CardContent>
      </Card>
    </div>
  );
}
