import styled from "@emotion/styled";
import React, { useContext, useEffect } from "react";
import { Context } from "./context";

const SelectOption = styled.div``;

export function Option({
  value,
  children,
  ...rest
}: {
  value: string | number;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  const {
    value: valueContext,
    _setValue,
    setAllOptions,
    onChange,
  } = useContext(Context);

  useEffect(() => {
    setAllOptions((prev: { label: any; value: number | string }[]) => {
      if (prev.findIndex((item) => item.value === value) === -1) {
        return prev.concat([
          {
            label: children,
            value,
          },
        ]);
      }
      return prev;
    });
  }, [value]);

  function onChangeHandler() {
    if (onChange) {
      onChange(value);
    }
    if (valueContext === undefined) {
      _setValue(value);
    }
  }

  return (
    <SelectOption
      className="select-dropdown-item"
      onClick={onChangeHandler}
      {...rest}
    >
      {children}
    </SelectOption>
  );
}
