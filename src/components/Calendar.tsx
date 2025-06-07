import {
  CalendarMode,
  ColorScheme,
  type CalendarModeT,
  type CalendarView,
} from "./types";
import { DateTime, IANAZone, Zone } from "luxon";
import CalendarGutter from "./Gutter";
import CalendarColumn from "./HorizontalGrid";
import ColumnHeader from "./ColumnHeader";
import HorizontalGrid from "./HorizontalGrid";
import InteractiveColumn from "./Column";
import { State } from "../calendar.island";
import { useContext } from "preact/hooks";
import { computed } from "@preact/signals";
import {
  flexCol,
  flexRow,
  globalVars,
  gridContainer,
  gridListContainer,
  headerStyle,
} from "./Calendar.css";
import ViewButtons from "./ViewButtons";
import DateButtons from "./DateButtons";
import MonthView from "./MonthView";
import { bigSeparator, smallSpearator } from "./Buttons.css";
import TimeIndicator from "./TimeIndicator";

const Calendar = () => {
  let state = useContext(State);

  let timezone = state.defaultTimezone.value;

  if (!timezone.isValid) {
    return;
  }

  let lowerBound = computed(() => {
    return state.currentDate.value
      .startOf(state.currentMode.value == CalendarMode.Day ? "day" : "week")
      .setZone(timezone)
      .set({ hour: state.startTime.value + 1 });
  });
  let upperBound = computed(() => {
    return state.currentDate.value
      .startOf(state.currentMode.value == CalendarMode.Day ? "day" : "week")
      .setZone(timezone)
      .set({ hour: state.endTime.value });
  });

  let numCols = computed(() =>
    state.currentMode.value == CalendarMode.Day
      ? 1
      : state.weekends.value
        ? 7
        : 5,
  );
  let headers = [];
  let body = [];
  let cDate =
    state.currentMode.value !== CalendarMode.Day
      ? state.currentDate.value.startOf("week")
      : state.currentDate.value;
  for (let i = 0; i < numCols.value; i++) {
    headers.push(
      <ColumnHeader
        numColumns={numCols.value}
        date={cDate}
        key={cDate.toString() + "-H"}
      />,
    );
    body.push(
      <InteractiveColumn
        numCols={numCols.value}
        numRows={(state.endTime.value - state.startTime.value) * 4}
        date={cDate}
      />,
    );
    cDate = cDate.plus({ days: 1 });
  }

  return (
    <div
      role="region"
      aria-label={"Calendar"}
      className={globalVars}
      style={
        state.colorScheme.value == ColorScheme.Light
          ? state.lightTheme.value
          : state.darkTheme.value
      }
    >
      <div className={flexRow} style={{ marginBottom: 4 }}>
        <DateButtons className={smallSpearator} />
        <MonthView className={bigSeparator} />
        <ViewButtons />
      </div>
      <div className={flexCol}>
        <div
          className={`${flexRow} ${headerStyle}`}
          style={{
            paddingLeft: `${state.showLocal.value ? 152.4 : 76.2}px`,
          }}
        >
          {headers}
        </div>
        <div className={flexRow}>
          <CalendarGutter lowerBound={lowerBound} upperBound={upperBound} />
          <div className={gridContainer}>
            <TimeIndicator lowerBound={lowerBound} upperBound={upperBound} />
            <HorizontalGrid
              cellCnt={state.endTime.value - state.startTime.value}
            />
            <ul className={gridListContainer}>{body}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
