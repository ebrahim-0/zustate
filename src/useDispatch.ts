import { create } from "zustand";
import { config } from "./setZustateConfig";

let userGlobalState: Record<string, any> = {};
let userCreateDispatch:
  | ((
      data: { type: string; payload: any },
      tools: {
        update: (
          payload?: any,
          key?: string,
          cb?: (pa?: object) => void
        ) => void;
        addState: (newState: { [key: string]: any }, key?: string) => void;
        reset: (payload: string | string[]) => void;
        dirty: (payload: string | string[]) => void;
      },

      actions: Record<string, string>
    ) => void | undefined)
  | undefined;

export type CreateDispatchType = typeof userCreateDispatch;

export interface DispatchParams {
  state: Record<string, any>;
  addState: (newState: { [key: string]: any }, key?: string) => void;
  update: (payload?: any, key?: string, cb?: (pa?: object) => void) => void;
}

interface GlobalState {
  state: Record<string, any>;
  actions: Record<string, string>;
  tempState: Record<string, any>; // Store temporary changes
  addState: (newState: { [key: string]: any }, key?: string) => void;
  dispatch: (
    payload?: any,
    key?: string,
    cb?: (pa?: DispatchParams) => void
  ) => void;
  reset: (payload: string | string[]) => void;
  dirty: (payload: string | string[]) => void;
  dispatcher: (action: string, payload: Record<string, any>) => void;
  createDispatcher: CreateDispatchType;
}

const initialTempState = {};

export const initializeState = (
  globalState?: Record<string, any>,
  createDispatch?: CreateDispatchType
) => {
  userGlobalState = globalState || {};
  userCreateDispatch = createDispatch;

  useDispatch.setState({
    state: { ...globalState },
    createDispatcher: createDispatch,
  });
  console.log("🚀 ~ config:", config);
};

export const useDispatch = create<GlobalState>((set, get) => ({
  state: {
    ...userGlobalState,
  },
  actions: {},
  tempState: initialTempState, // Initialize temporary state
  createDispatcher: userCreateDispatch,

  addState: (newState: { [key: string]: any }, key?: string) => {
    const currentState = get().state;

    if (key) {
      currentState[key] = { ...currentState[key], ...newState };
      get().tempState = {
        ...get().tempState,
        [key]: { ...currentState[key], ...newState },
      };
      return;
    }

    Object.keys(newState).forEach((key) => {
      currentState[key] = newState[key]; // Mutate directly
      get().tempState = { ...get().tempState, [key]: newState[key] };
    });

    if (config?.debug) {
      console.log("🚀 ~ state:", get().state);
    }
  },

  dispatch: (
    payload: string | object | ((params: DispatchParams) => void),
    key?: string
  ): void | DispatchParams => {
    const { tempState, state, addState, dispatch } = get();

    if (typeof payload === "function") {
      payload({ state, addState, update: dispatch } as DispatchParams);
      return;
    }

    if (Object.keys(tempState).length > 0) {
      set((state) => ({
        state: { ...state.state, ...tempState },
        tempState: initialTempState, // Reset tempState here
      }));
    }

    if (key) {
      set((state) => ({
        state: {
          ...state.state,
          [key]:
            typeof payload === "object"
              ? { ...state.state[key], ...payload }
              : payload,
        },
      }));
    } else {
      set((state) => ({
        state: {
          ...state.state,
          ...(payload as { [key: string]: any }),
        },
      }));
    }

    if (config?.debug) {
      console.log("🚀 ~ state:", state);
    }
  },

  reset: (payload: string | string[]) => {
    if (Array.isArray(payload)) {
      payload.forEach((key) => {
        set((state) => ({
          state: { ...state.state, [key]: userGlobalState[key] },
        }));
      });
    } else {
      set((state) => ({
        state: { ...state.state, [payload]: userGlobalState[payload] },
      }));
    }

    if (config?.debug) {
      console.log("🚀 ~ state:", get().state);
    }
  },

  dirty: (payload: string | string[]) => {
    set((state) => {
      const newState = { ...state.state };

      if (Array.isArray(payload)) {
        payload.forEach((k) => delete newState[k]);
      } else {
        delete newState[payload];
      }

      if (config?.debug) {
        console.log("🚀 ~ state:", get().state);
      }

      return { state: newState };
    });
  },

  dispatcher: (action: string, payload: Record<string, any>) => {
    set((state) => ({
      actions: { ...state.actions, [action]: action },
    }));
    const { dispatch, addState, reset, dirty, createDispatcher } = get();

    if (createDispatcher) {
      createDispatcher(
        { payload, type: action },
        { update: dispatch, addState, reset, dirty },
        get().actions
      );
    } else {
      console.error("createDispatcher is not a function.");
    }

    set(() => ({
      actions: {},
    }));

    if (config?.debug) {
      console.log("🚀 ~ state:", get().state);
    }
  },
}));
