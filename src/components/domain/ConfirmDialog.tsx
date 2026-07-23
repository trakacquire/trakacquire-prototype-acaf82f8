import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  requireReason?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  danger = false,
  requireReason = false,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');
  const isValid = !requireReason || reason.trim().length >= 10;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(requireReason ? reason : undefined);
    setReason('');
    onClose();
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="bg-[var(--graphite)] border-[var(--line)] text-[var(--eggshell)] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--eggshell)] text-16 font-bold">{title}</DialogTitle>
          <DialogDescription className="text-[var(--stone)] text-14 mt-1">{description}</DialogDescription>
        </DialogHeader>

        {requireReason && (
          <div className="mt-2">
            <label className="text-12 text-[var(--stone)] mb-1 block">
              Motivo <span className="text-[var(--critical)]">*</span> (mín. 10 caracteres)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Descreva o motivo desta ação..."
              className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] placeholder:text-[var(--stone)] resize-none focus:outline-none focus:border-[var(--proof-blue)]"
            />
            {reason.trim().length > 0 && reason.trim().length < 10 && (
              <p className="text-11 text-[var(--critical)] mt-1">{10 - reason.trim().length} caracteres restantes</p>
            )}
          </div>
        )}

        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-md text-14 font-medium text-[var(--stone)] bg-[var(--zinc)] hover:text-[var(--eggshell)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`px-4 py-2 rounded-md text-14 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              danger
                ? 'bg-[var(--critical)] text-[var(--ink)] hover:opacity-90'
                : 'bg-[var(--eggshell)] text-[var(--ink)] hover:bg-white'
            }`}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
