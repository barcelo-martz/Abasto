"use client";
import { createContext, useContext, type ComponentProps } from "react";
import { Tabs as RTabs } from "radix-ui";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { CountBadge } from "../badge/count-badge";

type TabsStyle = "sliding" | "pill";
const Ctx = createContext<TabsStyle>("sliding");

export interface TabsProps extends ComponentProps<typeof RTabs.Root> {
  /** sliding: subrayado animado con conteos · pill: control segmentado. */
  styleVariant?: TabsStyle;
}

export function Tabs({ styleVariant = "sliding", className, ...props }: TabsProps) {
  return (
    <Ctx.Provider value={styleVariant}>
      <RTabs.Root className={cn("flex flex-col gap-space-md", className)} {...props} />
    </Ctx.Provider>
  );
}

export function TabsList({ className, ...props }: ComponentProps<typeof RTabs.List>) {
  const v = useContext(Ctx);
  return (
    <RTabs.List
      className={cn(
        "no-scrollbar flex overflow-x-auto",
        v === "sliding"
          ? "gap-space-lg border-b border-outline-variant/40"
          : "gap-1 rounded-xl bg-surface-container p-1 w-fit",
        className,
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends ComponentProps<typeof RTabs.Trigger> {
  icon?: string;
  count?: number;
}

export function TabsTrigger({ icon, count, className, children, ...props }: TabsTriggerProps) {
  const v = useContext(Ctx);
  return (
    <RTabs.Trigger
      className={cn(
        "relative inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap font-label-md text-label-md transition-all duration-200 disabled:opacity-50",
        v === "sliding"
          ? "px-1 pb-2 pt-2 text-on-surface-variant hover:text-primary data-[state=active]:text-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-secondary after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100"
          : "rounded-lg px-space-md py-2 text-on-surface-variant hover:text-primary data-[state=active]:bg-surface-container-lowest data-[state=active]:font-bold data-[state=active]:text-primary data-[state=active]:shadow-card-sm",
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
      {count != null && <CountBadge count={count} tone="primary" />}
    </RTabs.Trigger>
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof RTabs.Content>) {
  return (
    <RTabs.Content
      className={cn("animate-fade-in focus-visible:outline-none", className)}
      {...props}
    />
  );
}
