"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function GlobalDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryActionLabel = "Save",
  secondaryActionLabel = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  showFooter = true,
  side = "bottom" // shadcn drawer typically supports bottom natively, or custom sides if configured
}) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="border-border">
        <div className="mx-auto w-full max-w-sm">
          {(title || description) && (
            <DrawerHeader>
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </DrawerHeader>
          )}
          
          <div className="p-4 pb-0">
            {children}
          </div>
          
          {showFooter && (
            <DrawerFooter>
              {primaryActionLabel && (
                <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
              )}
              {secondaryActionLabel && (
                <Button variant="outline" onClick={onSecondaryAction || onClose}>
                  {secondaryActionLabel}
                </Button>
              )}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
