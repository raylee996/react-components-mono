import { useEffect, useRef } from "react";

export function usePrevious(defaultState: any) {
  const state = useRef(defaultState);

  useEffect(() => {
    state.current = defaultState;
  }, [defaultState]);

  return state.current;
}
