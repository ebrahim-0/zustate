"use client"

import React, { ReactNode, useEffect } from "react";
import { initializeGlobalState, CreateDispatchType } from "./index";

interface StateProviderProps {
  globalState?: Record<string, any>;
  createDispatch?: CreateDispatchType;
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({
  globalState,
  createDispatch,
  children,
}) => {
  useEffect(() => {
    initializeGlobalState(globalState, createDispatch);
  }, [globalState, createDispatch]);

  return <>{children}</>;
};
