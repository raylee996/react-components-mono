import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import { usePrevious } from "../usePrevious";
import { act } from "react-dom/test-utils";
import { sleep } from "utils";

const TestCom = ({ children }: any) => {
  const [state, setState] = React.useState(1);
  const prevState = usePrevious(state);

  return children({ state, setState, prevState });
};

test("use previous", async () => {
  let _state: any;
  let _setState: any;
  let _prevState: any;

  render(
    <TestCom>
      {({ state, setState, prevState }: any) => {
        _state = state;
        _setState = setState;
        _prevState = prevState;
        return null;
      }}
    </TestCom>,
  );

  act(() => {
    _setState(2);
  });
  await waitFor(() => sleep(1000), {
    timeout: 2000,
  });

  expect(_prevState).toBe(1);
  expect(_state).toBe(2);
  act(() => {
    _setState(3);
  });
  await waitFor(() => sleep(1000), {
    timeout: 2000,
  });

  expect(_prevState).toBe(2);
  expect(_state).toBe(3);
});
