import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-secondary", className)}
      {...props}
    />
  );
}

export { Skeleton };
