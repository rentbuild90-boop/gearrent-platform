"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function GlobalModal({ 
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
  maxWidth = "sm:max-w-[425px]"
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${maxWidth} border-border`}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle className="text-xl">{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        <div className="py-4">
          {children}
        </div>
        
        {showFooter && (
          <DialogFooter className="gap-2 sm:gap-0">
            {secondaryActionLabel && (
              <Button variant="outline" onClick={onSecondaryAction || onClose}>
                {secondaryActionLabel}
              </Button>
            )}
            {primaryActionLabel && (
              <Button onClick={onPrimaryAction}>
                {primaryActionLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
