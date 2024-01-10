import React, { useContext } from "react";
import { Context } from "./context";

export function FormItemLabel({
  colon,
  children,
}: {
  colon?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
  const { colon: globalColon } = useContext(Context);

  const showColon = (colon === undefined && globalColon) || colon;

  return (
    <div className="form-item-label">
      {children}
      {showColon && <span className="form-item-colon">:</span>}
    </div>
  );
}
