import { style } from "@vanilla-extract/css";

export const popupExterior = style({
  backgroundColor: "var(--event-popover-bg)",
  color: "var(--event-popover-color)",
  fontSize: "12px",
  position: "absolute",
  zIndex: 10,
  boxShadow: "0 2px 6px 0 rgba(0,0,0,.1)",
  borderRadius: "2px",
});

export const popupArrow = style({
  visibility: "hidden",
  selectors: {
    "&, &::before": {
      position: "absolute",
      width: "8px",
      height: "8px",
      background: "inherit",
    },
    "&::before": {
      visibility: "visible",
      content: "",
      transform: "rotate(45deg)",
    },

    [`${popupExterior}[data-popper-placement^='top'] > &`]: {
      bottom: "-4px",
    },
    [`${popupExterior}[data-popper-placement^='bottom'] > &`]: {
      top: "-4px",
    },
    [`${popupExterior}[data-popper-placement^='left'] > &`]: {
      right: "-4px",
      borderLeft: "1px solid var(--event-popover-border)",
      borderBottom: "1px solid var(--event-popover-border)",
    },
    [`${popupExterior}[data-popper-placement^='right'] > &`]: {
      left: "-4px",
    },

    [`${popupExterior}[data-popper-placement^='left'] > &::before`]: {
      borderRight: "1px solid var(--event-popover-border)",
      borderTop: "1px solid var(--event-popover-border)",
    },
    [`${popupExterior}[data-popper-placement^='right'] > &::before`]: {
      borderLeft: "1px solid var(--event-popover-border)",
      borderBottom: "1px solid var(--event-popover-border)",
    },
  },
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
