import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { deepClone } from "utils";
import { Context } from "./context";
import { Item } from "./FormItem";
import { FormInstance, TField } from "./interface";

type TProps = {
  initialValues?: Record<string, any>;
  onValuesChange?: (
    changedValues: Record<string, any>,
    values: Record<string, any>,
  ) => void;
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: ({
    values,
    errorFields,
  }: {
    values: Record<string, any>;
    errorFields: {
      name: string[];
      errors: string[];
    }[];
  }) => void;
};

export const Form = React.forwardRef(
  (
    {
      initialValues,
      onValuesChange,
      children, // onFinish,
    }: TProps & React.ComponentPropsWithRef<React.ElementType>,
    forwardedRef: React.ForwardedRef<FormInstance | null>,
  ) => {
    const formRef = useRef<{
      data: TField[];
      itemsRef: Record<string, any>;
    }>({
      data: [],
      itemsRef: {},
    });

    useImperativeHandle(forwardedRef, () => ({
      getFieldsValue: (nameList) => {
        const allValues = formRef.current.data.reduce((prev: any, cur: any) => {
          return {
            ...prev,
            [cur.name]: cur.value,
          };
        }, {});
        if (nameList) {
          return nameList.reduce((prev, cur) => {
            return {
              ...prev,
              [cur]: allValues[cur],
            };
          }, {});
        } else {
          return allValues;
        }
      },
      getFieldValue: (name) => {
        return formRef.current.data.find((item: TField) => item.name === name)
          ?.value;
      },
      resetFields: (nameList) => {
        // 重置form数据
        // 有initialValues => data = initialValues
        // 沒有initialValues =>  data = null
        if (nameList) {
          nameList.forEach((name) => {
            const target = formRef.current.data.find(
              (item) => item.name === name,
            );
            if (target) {
              target.errors = [];
              target.value = initialValues?.[name] ?? null;
            }
            if (formRef.current.itemsRef[name]) {
              formRef.current.itemsRef[name].setField({
                value: initialValues[name] ?? null,
                errors: [],
              });
            }
          });
        } else {
          formRef.current.data.forEach((item) => {
            item.errors = [];
            item.value = initialValues[item.name] ?? null;
          });
          Object.keys(formRef.current.itemsRef).forEach((name) => {
            formRef.current.itemsRef[name].setField({
              value: initialValues[name] ?? null,
              errors: [],
            });
          });
        }

        // 重置item内部状态
        // 获取每一个item？
        // 遍历调用？

        // 设置了name的无法受控
        //
      },
      setFields: (fields) => {
        fields.forEach((field) => {
          const target = formRef.current.data.find(
            (item) => item.name === field.name,
          );
          const next: any = {};
          if (field.errors) {
            if (target) {
              target.errors = field.errors;
            }
            next.errors = field.errors;
          }
          if (field.value) {
            if (target) {
              target.value = field.value;
            }
            next.value = field.value;
          }
          if (
            Object.keys(next).length > 0 &&
            formRef.current.itemsRef[field.name]
          ) {
            formRef.current.itemsRef[field.name].setField((prev: any) => ({
              ...prev,
              ...next,
            }));
          }
        });
      },
    }));

    return (
      <Context.Provider
        value={{
          initialValues,
          formRef,
          onValuesChange,
        }}
      >
        {children}
      </Context.Provider>
    );
  },
) as unknown as ((
  props: TProps &
    React.ComponentPropsWithRef<React.ElementType> & {
      ref?: React.ForwardedRef<FormInstance | null>;
    },
) => React.ReactElement) & {
  Item: typeof Item;
};
