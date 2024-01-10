import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Input } from "../../src/Input";

const meta: Meta<typeof Input> = {
  /* 👇 The title prop is optional.
   * Seehttps://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

//👇 The ListTemplate construct will be spread to the existing stories.
export const InputTemplate: Story = {
  render: (props) => {
    const [value, setValue] = useState("def");

    return (
      <Input
        value={value}
        onChange={(e) => {
          console.log("e: ", e);
          setValue(e.target.value);
        }}
      />
    );
  },
};

/* export const InputItem: any = {
  ...InputTemplate,
  args: {

  }
} */
