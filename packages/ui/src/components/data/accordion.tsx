"use client";
import { Accordion as RadixAccordion } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface AccordionItemData {
  value: string;
  question: ReactNode;
  answer: ReactNode;
  icon?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  /** single: uno abierto a la vez · multiple: varios. */
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  className?: string;
}

/** Acordeón de consultas clínicas (FAQ). */
export function Accordion({ items, type = "single", defaultValue, className }: AccordionProps) {
  const children = items.map((it) => (
    <RadixAccordion.Item
      key={it.value}
      value={it.value}
      className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-card-sm transition-shadow data-[state=open]:shadow-card"
    >
      <RadixAccordion.Header>
        <RadixAccordion.Trigger className="group flex w-full items-center gap-space-sm px-space-md py-space-sm text-left font-headline-sm text-headline-sm text-primary transition-colors hover:bg-surface-container-low">
          {it.icon && <Icon name={it.icon} size={20} className="text-secondary" />}
          <span className="flex-1">{it.question}</span>
          <Icon
            name="expand_more"
            size={22}
            className="text-outline transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-secondary"
          />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="overflow-hidden data-[state=closed]:hidden">
        <div className="px-space-md pb-space-md pl-[calc(var(--spacing-space-md))] font-body-md text-body-md text-on-surface-variant">
          {it.answer}
        </div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  ));
  const cls = cn("flex flex-col gap-space-xs", className);
  if (type === "multiple") {
    return (
      <RadixAccordion.Root
        type="multiple"
        defaultValue={
          Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : undefined
        }
        className={cls}
      >
        {children}
      </RadixAccordion.Root>
    );
  }
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={Array.isArray(defaultValue) ? defaultValue[0] : defaultValue}
      className={cls}
    >
      {children}
    </RadixAccordion.Root>
  );
}
