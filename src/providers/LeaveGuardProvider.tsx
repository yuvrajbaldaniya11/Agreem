import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type LeaveHandler = (proceed: () => void) => void;

interface LeaveGuardValue {
  /** A screen registers while it has unsaved work, and clears when it does not. */
  setGuard: (handler: LeaveHandler | null) => void;
  requestLeave: (proceed: () => void) => void;
}

const LeaveGuardContext = createContext<LeaveGuardValue | undefined>(undefined);

/**
 * Lets the tab bar ask the focused screen for permission before navigating away
 * without the tab bar knowing anything about form state.
 */
export const LeaveGuardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const guard = useRef<LeaveHandler | null>(null);

  const setGuard = useCallback((handler: LeaveHandler | null) => {
    guard.current = handler;
  }, []);

  const requestLeave = useCallback((proceed: () => void) => {
    if (guard.current) {
      guard.current(proceed);
      return;
    }
    proceed();
  }, []);

  const value = useMemo(() => ({ setGuard, requestLeave }), [setGuard, requestLeave]);

  return <LeaveGuardContext.Provider value={value}>{children}</LeaveGuardContext.Provider>;
};

export const useLeaveGuard = (): LeaveGuardValue => {
  const context = useContext(LeaveGuardContext);
  if (!context) {
    throw new Error('useLeaveGuard must be used inside LeaveGuardProvider');
  }
  return context;
};
