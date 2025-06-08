import { style } from "@vanilla-extract/css";

export const eventList = style({
  position: "relative",
  margin: "0 !important",
  padding: "0 !important",
  height: "100%",
});

export const calColumn = style({
  selectors: {
    "&[data-today='true']": {
      backgroundColor: "var(--calendar-today-bg-color)",
    },
    "&:not(:last-child)": {
      borderRight: "solid 1px",
    },
    "&::marker": {
      content: "none",
      display: "none",
    },
    "&::before": {
      content: "''!important",
      display: "none",
    },
  },
});
