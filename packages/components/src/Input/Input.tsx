import React, { useEffect, useState } from "react";

export function Input({
  defaultValue,
  value,
  onChange,
  ...rest
}: {
  defaultValue?: string | number | readonly string[] | undefined;
  value?: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [_value, _setValue] = useState(defaultValue ?? "");

  // 受控
  useEffect(() => {
    if (value !== undefined) {
      _setValue(value);
    }
  }, [value]);

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange && e.target.value !== _value) {
      onChange(e);
    }
    // 非受控
    if (value === undefined && e.target.value !== _value) {
      _setValue(e.target.value);
    }
  }

  return <input value={_value} {...rest} onChange={onChangeHandler} />;
}
