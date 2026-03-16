import { Avatar, AvatarFallback, AvatarImage } from "@cosmos-explorer/ui/avatar";
import { ComponentPreview } from "@/components/component-preview";

export default function AvatarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Avatar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An image element with a fallback for representing the user.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">With image</h2>
        <ComponentPreview>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Fallback</h2>
        <ComponentPreview>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>XR</AvatarFallback>
          </Avatar>
        </ComponentPreview>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <ComponentPreview>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">S</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </ComponentPreview>
      </section>
    </div>
  );
}
