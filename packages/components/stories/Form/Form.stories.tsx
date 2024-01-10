import type { Meta, StoryObj } from "@storybook/react";
import React, { useRef } from "react";
import Form from "../../src/Form";
import { FormInstance } from "../../src/Form/interface";
import { Input } from "../../src/Input";
import Select from "../../src/Select";
import { Button } from "../Button";

const meta: Meta<typeof Form> = {
  /* 👇 The title prop is optional.
   * Seehttps://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Form",
  component: Form,
};

export default meta;
type Story = StoryObj<typeof Form>;

const initialValues = {
  test: "2",
  group: "group1",
};

//👇 The ListTemplate construct will be spread to the existing stories.
const FormTemplate: Story = {
  render: (props) => {
    const form = useRef<FormInstance>();

    console.log("props: ", props);
    return (
      <Form ref={form} {...props}>
        <Form.Item name="test" label="test">
          <Input />
        </Form.Item>
        <Form.Item name="group" label="group">
          <Select
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
        <Form.Item>
          <Button
            label="reset"
            onClick={() => {
              if (form.current) {
                form.current.resetFields();
              }
            }}
          />
        </Form.Item>
      </Form>
    );
  },
};

export const FormItem: any = {
  ...FormTemplate,
  args: {
    initialValues,
    onValuesChange: (changedValues: any, values: any) => {
      console.log("values: ", values);
      console.log("changedValues: ", changedValues);
    },
  },
};
