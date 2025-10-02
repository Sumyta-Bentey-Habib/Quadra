"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export function useAlertDialog() {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState({
    title: "",
    description: "",
    confirmText: "OK",
    cancelText: null,
    onConfirm: null,
  });

  function showAlert({ title, description, confirmText = "OK", cancelText = null, onConfirm = null }) {
    setDialog({ title, description, confirmText, cancelText, onConfirm });
    setOpen(true);
  }

  const AlertDialogUI = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {dialog.cancelText && <AlertDialogCancel>{dialog.cancelText}</AlertDialogCancel>}
          <AlertDialogAction
            onClick={() => {
              if (dialog.onConfirm) dialog.onConfirm();
              setOpen(false);
            }}
          >
            {dialog.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { showAlert, AlertDialogUI };
}
