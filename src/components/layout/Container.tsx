import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("container-site relative", className)} {...props}>
      {children}
    </div>
  );
}
