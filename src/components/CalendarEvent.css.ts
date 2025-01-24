import { style } from "@vanilla-extract/css";
import { globalVars } from "./Calendar.css";

export const calendarEventContainer = style({
  position: "absolute",
  backgroundColor: "var(--event-background)",
  borderRadius: "4px",
  border: "var(--event-border-width) solid var(--event-border-color)",
  overflowY: "hidden",
  cursor: "pointer",
  userSelect: "none",
  listStyleType: "none",
});

export const calendarEventInternal = style({
  paddingLeft: "2px",
  paddingTop: "1px",
  paddingBottom: "1px",
  borderLeft: "3px solid",
  height: "100%",
  fontSize: "12px",
  color: "var(--event-foreground)",
  borderColor: "var(--event-border-color)",
  display: "flex",
  flexDirection: "column",
});

export const calendarEventTitle = style({
  WebkitLineClamp: "1",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

export const calendarDate = style({
  fontWeight: 600,
  marginRight: "4px",
});

export const locationIcon = style({
  width: "12px",
  height: "12px",
});

export const locationHolder = style({
  display: "flex",
  alignItems: "center",
});
