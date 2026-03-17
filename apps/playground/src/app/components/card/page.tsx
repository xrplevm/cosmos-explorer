import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cosmos-explorer/ui/card";
import { Button } from "@cosmos-explorer/ui/button";
import { ComponentPreview } from "@/components/component-preview";

export default function CardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Card</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Displays a card with header, content, and footer.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Default</h2>
        <ComponentPreview>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card content with any elements inside.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Stats cards</h2>
        <ComponentPreview>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Transactions</CardDescription>
                <CardTitle className="text-3xl">1,284</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Block Height</CardDescription>
                <CardTitle className="text-3xl">482,910</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">~6s block time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Validators</CardDescription>
                <CardTitle className="text-3xl">150</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">98.7% uptime</p>
              </CardContent>
            </Card>
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
