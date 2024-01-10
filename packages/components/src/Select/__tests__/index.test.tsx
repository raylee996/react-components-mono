import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import React, { useState } from "react";
import Select from "..";

const OPTIONS = [
  {
    label: "label1",
    value: "value1",
  },
  {
    label: "label2",
    value: "value2",
  },
];

describe("select", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test("with options", () => {
    render(<Select options={OPTIONS} data-testid="test" />);

    expect(
      screen.getByTestId("test").querySelectorAll(".select-dropdown-item")
        ?.length,
    ).toBe(2);
    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("");
    expect(
      screen.getByTestId("test").querySelector(".select-dropdown"),
    ).not.toBeVisible();
  });

  test("open dropdown", async () => {
    render(<Select options={OPTIONS} data-testid="test" />);

    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelector(".select-dropdown-caret") as Element,
      );
    });
    expect(
      screen.getByTestId("test").querySelector(".select-dropdown"),
    ).toBeVisible();

    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelector(".select-dropdown-caret") as Element,
      );
    });
    expect(
      screen.getByTestId("test").querySelector(".select-dropdown"),
    ).not.toBeVisible();
  });

  test("uncontrolled select", async () => {
    render(
      <Select defaultValue="value1" options={OPTIONS} data-testid="test" />,
    );

    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("label1");

    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelector(".select-dropdown-caret") as Element,
      );
    });
    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelectorAll(".select-dropdown-item")[1] as Element,
      );
    });
    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("label2");
  });

  test("controlled select - no children", async () => {
    function App() {
      const [value, setValue] = useState("value1");

      return (
        <Select
          data-testid="test"
          options={OPTIONS}
          value={value}
          onChange={(val) => {
            setValue(val as string);
          }}
        />
      );
    }

    render(<App />);

    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("label1");

    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelector(".select-dropdown-caret") as Element,
      );
    });
    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelectorAll(".select-dropdown-item")[1] as Element,
      );
    });
    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("label2");
  });

  test("controlled select - children", async () => {
    function App() {
      const [value, setValue] = useState("value1");

      return (
        <Select
          data-testid="test"
          value={value}
          onChange={(val) => {
            setValue(val as string);
          }}
        >
          {OPTIONS.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      );
    }

    render(<App />);

    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("label1");

    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelector(".select-dropdown-caret") as Element,
      );
    });
    await act(async () => {
      await user.click(
        screen
          .getByTestId("test")
          .querySelectorAll(".select-dropdown-item")[1] as Element,
      );
    });
    expect(
      screen.getByTestId("test").querySelector(".select-input")?.innerHTML,
    ).toBe("label2");
  });
});
