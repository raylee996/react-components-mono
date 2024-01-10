import React, { useContext, useEffect, useMemo, useState } from "react";
import { deepClone } from "utils";
import { Context } from "./context";
import { FormItemLabel } from "./FormItemLabel";
import { TField } from "./interface";

type Tprops = {
  colon?: boolean;
  name?: string;
  label?: string;
  rules?: {
    message?: string;
    pattern?: RegExp;
    validator?: (val: any) => Promise<any>;
  }[];
};

const getValue = (e: any, type: string) => {
  switch (type) {
    case "Select":
      return e;
    case "Input":
      return e.target.value;
    case "CheckBox":
      return e.target.checked;
    default:
      return e;
  }
};

export const Item = ({
  colon,
  name,
  label,
  rules,
  children,
}: Tprops &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => {
  const { initialValues, onValuesChange, formRef } = useContext(Context);

  const [field, setField] = useState<{
    value: any;
    errors: any[];
  }>({
    value: name ? initialValues?.[name] ?? null : null,
    errors: [],
  });

  useEffect(() => {
    if (name) {
      formRef.current.data.push({
        name,
        value: initialValues?.[name] ?? null,
        errors: [],
      });
      formRef.current.itemsRef[name] = { setField };
    }
  }, []);

  //
  async function validate(val: any) {
    const errs = [];
    if (rules) {
      for (let i = 0; i < rules.length; i++) {
        const { message, pattern, validator } = rules[i];
        if (validator) {
          try {
            await validator(val);
          } catch (err) {
            errs.push(err.message);
          }
        } else if (pattern && !pattern.test(val)) {
          errs.push(message);
        }
      }
    }
    return errs;
  }

  const onChangeHandler = async (e: any) => {
    if (!name) return;
    const { value: valueProps, onChange } = (children as any)?.props;
    const target = getValue(e, (children as any)?.type?.name);
    if (valueProps === undefined) {
      const errors = await validate(target);
      setField({
        value: target,
        errors,
      });
      const pos = formRef.current.data.findIndex(
        (item: TField) => item.name === name,
      );
      formRef.current.data[pos].value = target;
      if (rules) {
        formRef.current.data[pos].errors = errors;
      }
    }
    if (onChange) {
      onChange(target);
    }
    if (onValuesChange) {
      onValuesChange(
        {
          [name]: target,
        },
        {
          ...formRef.current.data.reduce((prev: any, cur: any) => {
            return {
              ...prev,
              [cur.name]: cur.value,
            };
          }, {}),
          [name]: target,
        },
      );
    }
  };

  return (
    <div className="form-item">
      <div className="form-item-inner">
        {label && <FormItemLabel colon={colon}>{label}</FormItemLabel>}
        {React.Children.map(
          children,
          (
            child: React.ReactElement<
              any,
              string | React.JSXElementConstructor<any>
            >,
          ) => {
            const { value: valueProps, ...restProps } = child.props;
            return {
              ...child,
              props: {
                value: name ? field.value : valueProps,
                ...restProps,
                onChange: onChangeHandler,
              },
            };
          },
        )}
      </div>
      {field.errors?.map((msg) => {
        return (
          <div key={msg} className="form-item-error">
            {msg}
          </div>
        );
      })}
    </div>
  );
};
