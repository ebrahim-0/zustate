import { useDispatch } from "./useDispatch";

export const useSelector = (key: string | string[], defaultValue: any = "") => {
  const { state, dispatch } = useDispatch();

  const currentState = state;

  if (Array.isArray(key)) {
    return key.map((k, index) => state[k] ?? defaultValue[index]);
  }

  // Update state if the key does not exist
  if (!(key in currentState)) {
    dispatch({ [key]: defaultValue });
  }
  return state[key] ?? defaultValue;
};
