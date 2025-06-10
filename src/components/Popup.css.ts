import { style } from "@vanilla-extract/css";

export const popupExterior = style({
  backgroundColor: "var(--event-popover-bg)",
  color: "var(--event-popover-color)",
  fontSize: "12px",
  zIndex: 30,
  boxShadow: "0 2px 6px 0 rgba(0,0,0,.1)",
  borderRadius: "2px",
});

export const popupInterior = style({
  border: "1px solid var(--event-popover-border)",
  borderRadius: "2px 2px 0 0",
  padding: "15px",
  width: "300px",
});

export const popupColorBar = style({
  position: "absolute",
  borderRadius: "2px 2px 0 0",
  height: "4px",
  border: "none",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "var(--event-background)",
});

export const popupFooter = style({
  display: "flex",
  flexDirection: "row",
  borderLeft: "1px solid var(--event-popover-border)",
  borderBottom: "1px solid var(--event-popover-border)",
  borderRight: "1px solid var(--event-popover-border)",
  borderRadius: "0 0 2px 2px",
});

export const popupLink = style({
  color: "var(--event-popover-link-color)",
  textDecoration: "underline",
  textDecorationColor:
    "color-mix(in srgb, var(--event-popover-link-color) 20%, transparent)",
  display: "flex",
  flexDirection: "row",
  marginLeft: "auto",
  marginRight: "auto",
  paddingTop: "2px",
  paddingBottom: "4px",
  selectors: {
    "&:hover": {
      textDecoration: "underline",
      textDecorationColor: "var(--event-popover-link-color)",
    },
  },
});
