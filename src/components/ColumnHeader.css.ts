import { style } from "@vanilla-extract/css";

export const colHeaderBtn = style({
  background: "inherit",
  border: "0px",
  margin: 0,
  fontSize: "2em",
  overflow: "hidden",
  textAlign: "left",
  cursor: "pointer",
  color: "var(--calendar-day-color)",
  selectors: {
    "&[data-today='true']": {
      color: "var(--calendar-today-color)",
      fontWeight: 600,
    },
    "&:hover": {
      color: "var(--calendar-day-hover-color)",
      backgroundColor: "var(--calendar-day-hover-bg-color)",
    },
    "&:focus": {
      outline: "revert",
      color: "var(--calendar-day-hover-color)",
      backgroundColor: "var(--calendar-day-hover-bg-color)",
    },
  },
});
