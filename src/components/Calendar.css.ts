import { globalStyle, style } from "@vanilla-extract/css";

export const globalVars = style({});

globalStyle(`${globalVars} *`, {
  color: "unset",
  fontSize: "unset",
  margin: "unset",
  padding: "unset",
  boxSizing: "border-box",
});

export const srOnly = style({
  //@ts-ignore (it doesn't think important is real. good call honestly but it is rn.)
  position: "absolute !important",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px !important",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
});

export const margin0 = style({
  margin: 0,
});

export const flexRow = style({
  display: "flex",
  flexDirection: "row",
});

export const flexCol = style({
  display: "flex",
  flexDirection: "column",
});

export const headerStyle = style({
  borderBottomWidth: "2px",
  borderBottomStyle: "solid",
  borderTopWidth: "2px",
  borderTopStyle: "solid",
  height: "40px",
});

export const gridContainer = style({
  width: 1,
  flexGrow: "1",
  position: "relative",
});

export const gridListContainer = style({
  zIndex: 10,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "row",
  padding: "0px !important",
  margin: "0px !important",
});
