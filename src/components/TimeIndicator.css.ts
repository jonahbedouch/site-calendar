import { style } from "@vanilla-extract/css";

export const timeIndicatorDashed = style({
  position: "absolute",
  borderTopWidth: "1px",
  borderTopStyle: "dashed",
  borderColor: "var(--calendar-today-color)",
});

export const timeIndicatorFeature = style({
  width: "9px",
  height: "9px",
  margin: "-4px 0 0 -5px",
  borderRadius: "100%",
  backgroundColor: "var(--calendar-today-color)",
  position: "absolute",
});

export const timeIndicatorSolid = style({
  position: "absolute",
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderColor: "var(--calendar-today-color)",
});
