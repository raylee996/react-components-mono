import "@testing-library/jest-dom";
import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import React, { useEffect, useRef, useState } from "react";
import { sleep } from "utils";
import { Input } from "../../Input";
import Select from "../../Select";
import Form from "..";
import { FormInstance } from "../interface";

describe("form", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test("basic", () => {
    const initialValues = {
      name: "1",
      group: "group1",
    };

    render(
      <Form initialValues={initialValues}>
        <Form.Item name="name" label="name">
          <Input data-testid="testInput1" />
        </Form.Item>
        <Form.Item name="group" label="group">
          <Select
            data-testid="testSelect"
            options={[
              {
                label: "groupLabel1",
                value: "group1",
              },
              {
                label: "groupLabel2",
                value: "group2",
              },
            ]}
          />
        </Form.Item>
      </Form>,
    );

    expect(screen.getByTestId("testInput1").getAttribute("value")).toBe("1");
    expect(
      screen.getByTestId("testSelect").querySelector(".select-input")
        ?.innerHTML,
    ).toBe("groupLabel1");
  });

  test("compose", async () => {
    const initialValues = {
      test: "2",
      group: "group1",
    };

    let _changedValues: any;
    let _values: any;

    render(
      <Form
        initialValues={initialValues}
        onValuesChange={(changedValues: any, values: any) => {
          _changedValues = changedValues;
          _values = values;
        }}
      >
        <Form.Item name="test" label="test">
          <Input data-testid="testInput2" />
        </Form.Item>
        <Form.Item name="group" label="group">
          <Select
            data-testid="testSelect"
            options={[
              {
                label: "groupLabel1",
                value: "group1",
              },
              {
                label: "groupLabel2",
                value: "group2",
              },
            ]}
          />
        </Form.Item>
      </Form>,
    );

    await act(async () => {
      await user.type(screen.getByTestId("testInput2"), "a");
      await sleep(200);
    });
    expect(screen.getByTestId("testInput2").getAttribute("value")).toBe("2a");
    expect(_changedValues?.test).toBe("2a");
    expect(_values?.test).toBe("2a");
    expect(_values?.group).toBe("group1");
  });
});
