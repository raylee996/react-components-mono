import "@testing-library/jest-dom";
import * as React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Input } from "..";
import { sleep } from "utils";

const RenderInput = ({ children }: any) => {
  const [state, setState] = React.useState("def");

  return children({ state, setState });
};

describe("Input", () => {
  const defaultValue = "default";
  let user: UserEvent;

  beforeAll(() => {
    user = userEvent.setup();
  });

  test("uncontrolled", async () => {
    let value = "";

    render(
      <Input
        defaultValue={defaultValue}
        onChange={(e) => {
          value = e.target.value;
        }}
        data-testid="test"
      />,
    );

    expect(screen.getByTestId("test").getAttribute("value")).toBe("default");

    await user.clear(screen.getByTestId("test"));
    await user.type(screen.getByTestId("test"), "hello world");

    expect(screen.getByTestId("test").getAttribute("value")).toBe(
      "hello world",
    );
    expect(value).toBe("hello world");
  });

  test("controlled", async () => {
    let value: any = "";

    render(
      <RenderInput>
        {({ state }: any) => {
          value = state;
          return null;
        }}
      </RenderInput>,
    );

    render(<Input value={value} data-testid="tests" />);

    expect(value).toBe("def");
    expect(screen.getByTestId("tests").getAttribute("value")).toBe("def");
  });

  test("controlled onchange", async () => {
    function TestCom() {
      const [value, setValue] = React.useState("def");

      return (
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          data-testid="tests"
        />
      );
    }

    render(<TestCom />);

    await act(async () => {
      await user.clear(screen.getByTestId("tests"));
    });
    expect(screen.getByTestId("tests").getAttribute("value")).toBe("");

    await act(async () => {
      await user.type(screen.getByTestId("tests"), "3");
    });
    expect(screen.getByTestId("tests").getAttribute("value")).toBe("3");

    await act(async () => {
      fireEvent.change(screen.getByTestId("tests"), {
        target: { value: "chuck" },
      });
      await sleep(200);
    });
    expect(screen.getByTestId("tests").getAttribute("value")).toBe("chuck");
  });
});
