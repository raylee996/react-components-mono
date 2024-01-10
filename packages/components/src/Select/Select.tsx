import styled from "@emotion/styled";
import React, { useEffect, useMemo, useState } from "react";
import { Context } from "./context";
import { Option } from "./Option";

const SelectContainer = styled.div``;

const SelectInput = styled.div``;

const SelectDropdownCaret = styled.span`
  width: 0;
  height: 0;
  border-width: 5px;
`;

const SelectDropdown = styled.div``;

const SelectSelector = styled.div``;

export const Select = (({
  options,
  defaultValue,
  value,
  onChange,
  children,
  ...rest
}: {
  options?: { label: any; value: number | string }[];
  defaultValue?: number | string;
  value?: number | string;
  onChange?: (val: number | string) => void;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  const [_value, _setValue] = useState(defaultValue ?? "");

  const [dropDownVisible, setDropDownVisible] = useState(false);

  const [allOptions, setAllOptions] = useState<
    { label: any; value: number | string }[]
  >([]);

  const OptionList = useMemo(() => {
    return (
      options?.map(({ label, value }) => {
        return (
          <Option key={value} value={value}>
            {label}
          </Option>
        );
      }) ?? []
    );
  }, [options]);

  useEffect(() => {
    if (value !== undefined) {
      _setValue(value);
    }
  }, [value]);

  const selected = allOptions.find((item) => item.value === _value);

  return (
    <Context.Provider
      value={{
        onChange,
        _setValue,
        setAllOptions,
        value,
      }}
    >
      <SelectContainer className="select" {...rest}>
        <SelectSelector className="select-selector">
          <SelectInput className="select-input">{selected?.label}</SelectInput>
          <SelectDropdownCaret
            className="select-dropdown-caret"
            onClick={() => {
              setDropDownVisible(!dropDownVisible);
            }}
          />
        </SelectSelector>
        <SelectDropdown
          style={dropDownVisible ? { display: "block" } : { display: "none" }}
          className="select-dropdown"
        >
          {children}
          {OptionList}
        </SelectDropdown>
      </SelectContainer>
    </Context.Provider>
  );
}) as unknown as ((
  props: {
    options?: { label: any; value: number | string }[];
    defaultValue?: number | string;
    value?: number | string;
    onChange?: (val: number | string) => void;
  } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
) => React.ReactElement) & {
  Option: typeof Option;
};
