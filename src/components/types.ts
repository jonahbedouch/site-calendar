import type { DateTime } from "luxon";
import { Dispatch } from "preact/hooks";

export const ColorScheme = {
  Light: "light",
  Dark: "dark",
} as const;
export type ColorSchemeT = (typeof ColorScheme)[keyof typeof ColorScheme];

export const CalendarMode = {
  Day: "day",
  Week: "week",
} as const;
export type CalendarModeT = (typeof CalendarMode)[keyof typeof CalendarMode];

export type GlobalTheme = {
  "--calendar-today-color": string;
  "--calendar-day-color": string;
  "--calendar-day-hover-color": string;
  "--calendar-day-hover-bg-color": string;
  "--calendar-button-base": string;
  "--calendar-button-text": string;
  "--calendar-button-focus-ring": string;
  "--calendar-button-hover": string;
  "--calendar-button-text-hover": string;
  "--calendar-button-active": string;
  "--calendar-button-text-active": string;
  "--event-background": string;
  "--event-foreground": string;
  "--event-border-color": string;
  "--event-border-width": string;
  "--event-popover-bg": string;
  "--event-popover-border": string;
  "--event-popover-color": string;
  "--event-popover-link-color": string;
};

export type LocalTheme = {
  "--event-background": string;
  "--event-foreground": string;
  "--event-border-color": string;
  "--event-border-width": string;
  "--event-popover-bg": string;
  "--event-popover-border": string;
  "--event-popover-color": string;
  "--event-popover-link-color": string;
};

export type CalendarView = {
  defaultTimezone: string;
  defaultName: string;
  startTime: number;
  endTime: number;
  showLocal: boolean;
  allowedModes: CalendarModeT[];
  weekends: boolean;
};

export const CalendarAction = {
  Availability: 0,
} as const;
export type CalendarActionT =
  (typeof CalendarAction)[keyof typeof CalendarAction];

export type AvailabilityConfig = {
  type: (typeof CalendarAction)["Availability"];
  availability: Date[];
  setAvailability: Dispatch<Date[]>;
};

export type ActionConfig = AvailabilityConfig;

export type EventCategory = {
  id: String;
  name: String;
  lightTheme: Partial<LocalTheme>;
  darkTheme: Partial<LocalTheme>;
};

export type Event = {
  id: string;
  calendarId: string;
  title: string;
  body: string;
  location: string;
  start: DateTime;
  end: DateTime;
  links: { view: string; clone: string };
  category: EventCategory | undefined;
};

export type ProvidedUserEvent = {
  id: string;
  calendarId: string;
  title: string;
  body: string;
  location: string;
  start: Date | DateTime | string;
  end: Date | DateTime | string;
  links: { view: string; clone: string };
  category: string;
};
