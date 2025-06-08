import { DateTime, Zone } from "luxon";
import { ReadonlySignal, Signal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { State } from "../calendar.island";
import { flexRow, margin0 } from "./Calendar.css";
import {
  gutterBorder,
  gutterBox,
  localBorder,
  timeHeader,
  timeText,
  today,
} from "./Gutter.css";
import { CalendarMode, CalendarModeT } from "./types";

const TIME_OFFSET = -7;
const TIME_LBOUND = 10;
const TIME_UBOUND = 47;

// If it's a multi-day view, they should be based on the first day in the view.
interface Props {
  lowerBound: ReadonlySignal<DateTime>;
  upperBound: ReadonlySignal<DateTime>;
}

const CalendarGutter = (props: Props) => {
  const state = useContext(State);
  let mode = state.currentMode.value;
  let currentDate = state.currentDate.value;
  let weekendVisible = state.weekends.value;
  let timezone = state.defaultTimezone.value;
  let showLocal = state.showLocal.value;
  let startZone = props.lowerBound.value;
  let stopZone = props.upperBound.value;
  let startLocal = props.lowerBound.value.setZone("system");
  let stopLocal = props.upperBound.value.setZone("system");
  let zoneTimes: string[] = [];
  let localTimes: string[] = [];

  let now = DateTime.now().setZone(timezone);
  let weekStart = now.set({
    weekday: mode == CalendarMode.Week ? 1 : undefined,
  });
  let nowLocal = weekStart.setZone("system");

  let maxIndexDur = stopZone.diff(startZone, "hours").plus({ hours: 1 });
  let timeIndexDur = weekStart.diff(startZone, "hours");

  let displayTime =
    (mode == CalendarMode.Day && weekStart.hasSame(currentDate, "day")) ||
    (mode == CalendarMode.Week &&
      currentDate.startOf("week").equals(weekStart.startOf("week")) &&
      (weekendVisible || now.weekday < 6));
  let timeIndex = Math.max(
    Math.min(Math.floor(timeIndexDur.hours), maxIndexDur.hours - 2),
    -1,
  );
  let position =
    weekStart >= stopZone
      ? 60 + TIME_OFFSET
      : weekStart <= startZone.minus({ minutes: 60 - TIME_OFFSET })
        ? 0
        : weekStart.minute + TIME_OFFSET;
  let isSaturated =
    weekStart >= stopZone ||
    weekStart <= startZone.minus({ minutes: 60 - TIME_OFFSET });

  while (startZone < stopZone) {
    zoneTimes.push(startZone.toFormat("t"));
    startZone = startZone.plus({ hours: 1 });
  }
  if (showLocal) {
    while (startLocal < stopLocal) {
      localTimes.push(startLocal.toFormat("t"));
      startLocal = startLocal.plus({ hours: 1 });
    }
  }

  const isIndicatorVisible = (i: number) => {
    return (
      !displayTime ||
      isSaturated ||
      (i != timeIndex && i != timeIndex + 1) ||
      (i == timeIndex && weekStart.minute >= TIME_LBOUND) ||
      (i == timeIndex + 1 && weekStart.minute <= TIME_UBOUND)
    );
  };

  return (
    <div className={`${flexRow} ${gutterBorder}`} aria-hidden="true">
      <div style={{ width: "75px" }}>
        <div className={gutterBox}>
          {showLocal && (
            <h2 className={`${timeHeader} ${margin0}`}>
              {state.defaultTimezoneName}
            </h2>
          )}

          {displayTime &&
            timeIndex == -1 &&
            (showLocal == false || weekStart.minute >= 40) && (
              <p
                className={`${margin0} ${timeText}`}
                style={{
                  top: position,
                  color: "var(--calendar-today-color)",
                }}
              >
                {weekStart.toFormat("t")}
              </p>
            )}
        </div>
        {zoneTimes.map((time, i) => (
          <div className={gutterBox} key={`ztgb-${time}`}>
            {isIndicatorVisible(i) && (
              <p className={`${margin0} ${timeText}`}>{time}</p>
            )}

            {displayTime && i == timeIndex && (
              <p
                className={`${margin0} ${timeText} ${today}`}
                style={{
                  top: position,
                }}
              >
                {weekStart.toFormat("t")}
              </p>
            )}
          </div>
        ))}
      </div>
      {showLocal ? (
        <div className={localBorder} style={{ width: "75px" }}>
          <div className={gutterBox}>
            <h2 className={`${timeHeader} ${margin0}`}>Your Time</h2>
            {timeIndex == -1 && weekStart.minute >= 40 && (
              <p
                className={`${margin0} ${timeText} ${today}`}
                style={{
                  top: position,
                }}
              >
                {nowLocal.toFormat("t")}
              </p>
            )}
          </div>
          {localTimes.map((time, i) => (
            <div className={gutterBox} key={`ltgb-${time}`}>
              {isIndicatorVisible(i) && (
                <p className={`${margin0} ${timeText}`}>{time}</p>
              )}
              {displayTime && i == timeIndex && (
                <p
                  className={`${margin0} ${timeText} ${today}`}
                  style={{
                    top: position,
                  }}
                >
                  {nowLocal.toFormat("t")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CalendarGutter;
