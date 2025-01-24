import { style } from "@vanilla-extract/css";

export const buttonBase = style({
  all: "unset",
  paddingLeft: "1em",
  paddingRight: "1em",
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
  margin: 4,
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "var(--calendar-button-base)",
  color: "var(--calendar-button-text)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.12),0 3px 10px rgba(0,0,0,0.08)",
  borderRadius: 4,
  selectors: {
    "&:focus": {
      outline: "revert",
      boxShadow: "0 0 0 3px var(--calendar-button-focus-ring)",
    },
    "&:hover": {
      backgroundColor: "var(--calendar-button-hover)",
      color: "var(--calendar-button-text-hover)",
      boxShadow: "0 0 0 3px rgba(0,0,255,0.25)",
    },
    "&:active": {
      backgroundColor: "var(--calendar-button-active)",
      color: "var(--calendar-button-text-active)",
      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
    },
  },
});

export const bigSeparator = style({
  marginRight: "auto",
});

export const smallSpearator = style({
  marginRight: "auto",
  "@media": {
    "screen and (min-width: 500px)": {
      marginRight: 8,
    },
  },
});

export const monthText = style({
  display: "none",
  alignSelf: "center",
  fontWeight: 500,
  "@media": {
    "screen and (min-width: 420px)": {
      display: "block",
      fontSize: "1rem",
    },
    "screen and (min-width: 550px)": {
      display: "block",
      fontSize: "1.75rem",
    },
  },
});
