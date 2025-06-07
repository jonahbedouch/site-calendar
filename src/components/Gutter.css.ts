import { style } from "@vanilla-extract/css";

export const gutterBorder = style({
  borderRightWidth: "2px",
  borderRightStyle: "solid",
});

export const localBorder = style({
  borderLeftWidth: "1px",
  borderLeftStyle: "solid",
});

export const timeHeader = style({
  margin: "0 !important",
  paddingTop: "1.5em",
  fontSize: "12px !important",
  fontWeight: 600,
  height: "22px !important",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const timeText = style({
  margin: 0,
  fontSize: "12px",
  top: "-10px",
  right: "5px",
  position: "absolute",
});

export const gutterBox = style({
  height: "60px",
  position: "relative",
});

export const today = style({
  color: "var(--calendar-today-color)",
});
