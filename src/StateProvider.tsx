"use client"

import React, { ReactNode, useEffect } from "react";
import { initializeState, CreateDispatchType } from "./index";

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
    initializeState(globalState, createDispatch);
  }, [globalState, createDispatch]);

  return <>{children}</>;
};
