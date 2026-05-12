/**
 * useLoginPrompt
 * ──────────────
 * Provides a simple API to trigger the login prompt modal from anywhere.
 * Wraps a shared React state via a lightweight context-free approach
 * using a module-level event bus.
 */
import { useState, useCallback } from 'react';

export const useLoginPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [actionLabel, setActionLabel] = useState('continue');

  const promptLogin = useCallback((label = 'continue') => {
    setActionLabel(label);
    setIsOpen(true);
  }, []);

  const closePrompt = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, actionLabel, promptLogin, closePrompt };
};

export default useLoginPrompt;
