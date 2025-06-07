import { computed, ReadonlySignal, signal, Signal } from "@preact/signals";
import {
  CalendarMode,
  CalendarModeT,
  ColorScheme,
  ColorSchemeT,
  Event,
  EventCategory,
  GlobalTheme,
  ProvidedUserEvent,
} from "./components/types";
import { createContext } from "preact";
import { createIsland, Island } from "preact-island";
import Calendar from "./components/Calendar";
import { DateTime, IANAZone } from "luxon";

const DEFAULT_LIGHT_THEME: GlobalTheme = {
  "--event-background": "#B4C6E0",
  "--event-foreground": "rgba(29, 29, 29, 0.95)",
  "--event-border-color": "#084298",
  "--event-border-width": "1px",
  "--event-popover-bg": "#fff",
  "--event-popover-border": "#000",
  "--event-popover-color": "#000",
  "--event-popover-link-color": "#3B18D8",
  "--calendar-today-color": "#DD3333",
  "--calendar-today-bg-color": "rgba(81, 92, 230, 0.05)",
  "--calendar-day-color": "inherit",
  "--calendar-day-hover-color": "#DD3333",
  "--calendar-day-hover-bg-color": "inherit",
  "--calendar-button-base": "#f7f7f7",
  "--calendar-button-text": "#3818D8",
  "--calendar-button-focus-ring": "rgba(0,0,255,0.25)",
  "--calendar-button-hover": "rgba(59, 24, 216, 0.7)",
  "--calendar-button-text-hover": "#FFFFFF",
  "--calendar-button-active": "#3818D8",
  "--calendar-button-text-active": "#FFFFFF",
};

const DEFAULT_DARK_THEME: GlobalTheme = {
  "--event-background": "#084298",
  "--event-foreground": "rgba(255, 255, 255, 0.95)",
  "--event-border-color": "#B4C6E0",
  "--event-border-width": "0px",
  "--event-popover-bg": "#181A1B",
  "--event-popover-border": "#fff",
  "--event-popover-color": "#fff",
  "--event-popover-link-color": "#A0CFEE",
  "--calendar-today-color": "#FFAAAA",
  "--calendar-today-bg-color": "rgba(81, 92, 230, 0.05)",
  "--calendar-day-color": "inherit",
  "--calendar-day-hover-color": "#FFAAAA",
  "--calendar-day-hover-bg-color": "inherit",
  "--calendar-button-base": "#302d36",
  "--calendar-button-text": "#A0CFEE",
  "--calendar-button-focus-ring": "rgba(0,0,255,0.25)",
  "--calendar-button-hover": "rgba(160, 207, 238, 0.7)",
  "--calendar-button-text-hover": "#302d36",
  "--calendar-button-active": "rgb(160, 207, 238)",
  "--calendar-button-text-active": "rgb(39, 38, 43)",
};

export type AppStateS = {
  defaultTimezone: Signal<IANAZone>;
  defaultTimezoneName: Signal<string>;
  startTime: Signal<number>;
  endTime: Signal<number>;
  showLocal: ReadonlySignal<boolean>;
  allowedModes: Signal<CalendarModeT[]>;
  weekends: Signal<boolean>;
  currentDate: Signal<DateTime>;
  currentMode: Signal<CalendarModeT>;
  rawEvents: Signal<ProvidedUserEvent[]>;
  events: ReadonlySignal<Event[]>;
  filter: Signal<(arg0: Event) => boolean>;
  visibleEvents: ReadonlySignal<Event[]>;
  categories: Signal<EventCategory[]>;
  rawLightTheme: Signal<Partial<GlobalTheme>>;
  rawDarkTheme: Signal<Partial<GlobalTheme>>;
  lightTheme: Signal<GlobalTheme>;
  darkTheme: Signal<GlobalTheme>;
  initialized: Signal<boolean>;
  colorScheme: Signal<ColorSchemeT>;
};

export type AppState = {
  defaultTimezone: string;
  defaultTimezoneName: string;
  startTime: number;
  endTime: number;
  showLocal: boolean;
  allowedModes: CalendarModeT[];
  weekends: boolean;
  currentDate: DateTime;
  currentMode: CalendarModeT;
  events: ProvidedUserEvent[];
  filter: (arg0: Event) => boolean;
  categories: EventCategory[];
  lightTheme: GlobalTheme;
  darkTheme: GlobalTheme;
  initialized: boolean;
  colorScheme: ColorSchemeT;
};

function createState(values: Partial<AppState>): AppStateS {
  const defaultTimezone = signal(
    new IANAZone(values.defaultTimezone ?? "America/Los_Angeles"),
  );
  const defaultTimezoneName = signal(values.defaultTimezoneName ?? "PST");
  const startTime = signal(values.startTime ?? 0);
  const endTime = signal(values.endTime ?? 24);
  const showLocal = computed(() => {
    return (
      (values.showLocal ?? true) &&
      defaultTimezone.value.name !==
        Intl.DateTimeFormat("en-US").resolvedOptions().timeZone
    );
  });
  const allowedModes = signal(
    values.allowedModes ?? [CalendarMode.Day, CalendarMode.Week],
  );
  const weekends = signal(values.weekends ?? true);
  const currentMode = signal(values.currentMode ?? CalendarMode.Week);
  const currentDate = signal(
    values.currentDate?.setZone(defaultTimezone.value) ??
      DateTime.now().setZone(defaultTimezone.value).startOf("day"),
  );
  const categories = signal(values.categories ?? []);
  const rawEvents = signal(values.events ?? []);
  const events = computed(() => {
    return rawEvents.value.map((event): Event => {
      let newStart = event.start;
      let newEnd = event.end;
      if (newStart instanceof Date) {
        newStart = DateTime.fromJSDate(newStart);
      } else if (DateTime.isDateTime(newStart) == false) {
        newStart = DateTime.fromISO(newStart);
      }

      if (newEnd instanceof Date) {
        newEnd = DateTime.fromJSDate(newEnd);
      } else if (DateTime.isDateTime(newEnd) == false) {
        newEnd = DateTime.fromISO(newEnd);
      }

      let { category, start, end, location, ...restOfEvent } = event;

      newStart = newStart.setZone(defaultTimezone.value);
      newEnd = newEnd.setZone(defaultTimezone.value);

      return {
        category: categories.value.find(
          (category) => category.id == event.category,
        ),
        start: newStart,
        end: newEnd,
        location: location ?? "",
        ...restOfEvent,
      };
    });
  });
  const filter = signal(values.filter ?? ((_: Event) => true));
  const visibleEvents = computed(() => {
    return events.value.filter((event) => filter.value(event));
  });

  const initialized = signal(values.initialized ?? false);

  const rawLightTheme = signal<Partial<GlobalTheme>>(values.darkTheme ?? {});
  const rawDarkTheme = signal<Partial<GlobalTheme>>(values.lightTheme ?? {});

  const lightTheme = computed(() => {
    let theme = DEFAULT_LIGHT_THEME;

    for (const key in rawLightTheme.value) {
      if (Object.keys(theme).includes(key)) {
        theme[key as keyof GlobalTheme] =
          rawLightTheme.value[key as keyof GlobalTheme] ??
          theme[key as keyof GlobalTheme];
      }
    }

    return theme;
  });

  const darkTheme = computed(() => {
    let theme = DEFAULT_DARK_THEME;

    for (const key in rawDarkTheme.value) {
      if (Object.keys(theme).includes(key)) {
        theme[key as keyof GlobalTheme] =
          rawDarkTheme.value[key as keyof GlobalTheme] ??
          theme[key as keyof GlobalTheme];
      }
    }

    return theme;
  });

  const colorScheme = signal(values.colorScheme ?? ColorScheme.Light);

  return {
    defaultTimezone,
    defaultTimezoneName,
    startTime,
    endTime,
    showLocal,
    allowedModes,
    weekends,
    currentDate,
    currentMode,
    rawEvents,
    events,
    filter,
    visibleEvents,
    categories,
    initialized,
    rawLightTheme,
    rawDarkTheme,
    lightTheme,
    darkTheme,
    colorScheme,
  };
}

export const State = createContext<AppStateS>(createState({}));
export const StateManager = {
  updateFilter(
    filter: AppStateS["filter"],
    newFilter: (arg0: Event) => boolean,
  ) {
    filter.value = newFilter;
  },

  addEvents(events: AppStateS["rawEvents"], newEvents: ProvidedUserEvent[]) {
    events.value = [...events.value, ...newEvents];
  },

  addCategories(
    categories: AppStateS["categories"],
    newCategories: EventCategory[],
  ) {
    categories.value = [...categories.value, ...newCategories];
  },

  setDate(date: AppStateS["currentDate"], newDate: DateTime) {
    date.value = newDate;
  },

  setMode(mode: AppStateS["currentMode"], newMode: CalendarModeT) {
    mode.value = newMode;
  },

  setTheme(
    theme: AppStateS["rawLightTheme"] | AppStateS["rawDarkTheme"],
    newTheme: Partial<GlobalTheme>,
  ) {
    theme.value = newTheme;
  },

  setColorScheme(
    colorScheme: AppStateS["colorScheme"],
    newColorScheme: ColorSchemeT,
  ) {
    colorScheme.value = newColorScheme;
  },
};

function StateProvider(props: { state: AppStateS }) {
  const state = props.state;

  document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowLeft") {
      StateManager.setDate(
        props.state.currentDate,
        props.state.currentDate.value.minus({
          days: props.state.currentMode.value == CalendarMode.Day ? 1 : 7,
        }),
      );
    } else if (event.key == "ArrowRight") {
      StateManager.setDate(
        props.state.currentDate,
        props.state.currentDate.value.plus({
          days: props.state.currentMode.value == CalendarMode.Day ? 1 : 7,
        }),
      );
    } else if (event.key.toLowerCase() == "w") {
      StateManager.setMode(props.state.currentMode, CalendarMode.Week);
    } else if (event.key.toLowerCase() == "d") {
      StateManager.setMode(props.state.currentMode, CalendarMode.Day);
    } else if (event.key.toLowerCase() == "t") {
      StateManager.setDate(
        props.state.currentDate,
        DateTime.now().setZone(state.defaultTimezone.value).startOf("day"),
      );
    }
  });

  return (
    <State.Provider value={props.state}>
      <Calendar />
    </State.Provider>
  );
}

class CalendarStateManager {
  _selector: string;
  _island: Island<{ state: AppStateS }>;
  _state: AppStateS;

  constructor(selector: string, options: Partial<AppState>) {
    this._selector = selector;
    this._state = createState(options);
    this._island = createIsland(StateProvider);
  }

  render() {
    if (this._state.initialized.value) {
      this._island.rerender({ state: this._state });
    } else {
      this._island.render({
        selector: this._selector,
        initialProps: { state: this._state },
      });
    }
  }

  addEvents(events: ProvidedUserEvent[]) {
    StateManager.addEvents(this._state.rawEvents, events);
  }

  addCategories(categories: EventCategory[]) {
    StateManager.addCategories(this._state.categories, categories);
  }

  setDate(date: DateTime | Date) {
    if (!DateTime.isDateTime(date)) {
      date = DateTime.fromJSDate(date);
    }

    StateManager.setDate(
      this._state.currentDate,
      date.setZone(this._state.defaultTimezone.value),
    );
  }

  setLightTheme(theme: Partial<GlobalTheme>) {
    StateManager.setTheme(this._state.rawLightTheme, theme);
  }

  setDarkTheme(theme: Partial<GlobalTheme>) {
    StateManager.setTheme(this._state.rawDarkTheme, theme);
  }

  setColorScheme(colorScheme: ColorSchemeT) {
    StateManager.setColorScheme(this._state.colorScheme, colorScheme);
  }

  updateFilter(filter: (arg0: Event) => boolean) {
    StateManager.updateFilter(this._state.filter, filter);
  }
}

const CalendarBuilder = (selector: string, options: Partial<AppState>) => {
  const _stateManager = new CalendarStateManager(selector, options);
  _stateManager.render();
  return _stateManager;
};

//@ts-ignore we're mutating the window
window.SiteCalendar = { Calendar: CalendarBuilder };

//@ts-ignore
window.DateTime = DateTime;
