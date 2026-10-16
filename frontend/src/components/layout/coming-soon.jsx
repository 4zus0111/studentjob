import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/** Placeholder for pages that are built in a later step. */
export function ComingSoon({ title, description = "Chức năng này sẽ sớm được hoàn thiện." }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Construction className="size-6" />
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
