import { style } from "@vanilla-extract/css";
import { globalVars } from "./Calendar.css";

export const calendarEventContainer = style({
  position: "absolute",
  backgroundColor: "var(--event-background)",
  borderRadius: "0.25em",
  border: "var(--event-border-width) solid var(--event-border-color)",
  overflowY: "hidden",
  cursor: "pointer",
  userSelect: "none",
  listStyleType: "none",
  textWrap: "pretty",
  zIndex: 10,
});

export const calendarEventInternal = style({
  paddingLeft: "4px",
  paddingTop: "2px",
  paddingBottom: "2px",
  paddingRight: "4px",
  borderLeft: "3px solid",
  height: "100%",
  fontSize: "0.75em",
  color: "var(--event-foreground)",
  borderColor: "var(--event-border-color)",
  display: "flex",
});

export const calendarEventTitle = style({
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

export const calendarDate = style({
  fontWeight: 600,
  marginRight: "0.25em",
});

export const locationIcon = style({
  width: "12px",
  height: "12px",
});

export const locationHolder = style({
  display: "flex",
  flexGrow: 1,
  height: "15px",
  alignContent: "end",
});
