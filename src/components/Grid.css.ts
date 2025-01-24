import { style } from "@vanilla-extract/css";

export const cellGrid = style({
  selectors: {
    "&:not(:last-child)": {
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
    },
  },
});
