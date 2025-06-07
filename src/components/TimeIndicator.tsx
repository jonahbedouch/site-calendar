import { ReadonlySignal, Signal } from "@preact/signals";
import { DateTime } from "luxon";
import { useContext } from "preact/hooks";
import { State } from "../calendar.island";
import { CalendarMode } from "./types";
import {
  timeIndicatorDashed,
  timeIndicatorFeature,
  timeIndicatorSolid,
} from "./TimeIndicator.css";

interface Props {
  lowerBound: ReadonlySignal<DateTime>;
  upperBound: ReadonlySignal<DateTime>;
}

const TimeIndicator = (props: Props) => {
  let state = useContext(State);
  let timezone = state.defaultTimezone.value;
  let currentDate = state.currentDate.value;
  let mode = state.currentMode.value;
  let weekendVisible = state.weekends.value;
  let startZone = props.lowerBound.value.minus({ hours: 1 });
  let stopZone = props.upperBound.value;
  let now = DateTime.now().setZone(timezone);

  let renderLine =
    (mode == CalendarMode.Day && now.hasSame(currentDate, "day")) ||
    (mode == CalendarMode.Week &&
      now.hasSame(currentDate, "week") &&
      (weekendVisible || now.weekday < 6));

  let height = Math.min(
    Math.max(
      0,
      now
        .set({ weekday: mode == CalendarMode.Week ? 1 : undefined })
        .diff(startZone, "minutes").minutes,
    ),
    stopZone.diff(startZone, "minutes").minutes,
  );
  let solidOffset =
    mode == CalendarMode.Week
      ? `${(weekendVisible ? 14.2857 : 20) * (now.weekday - 1)}%`
      : "0%";
  let solidWidth =
    mode == CalendarMode.Week ? (weekendVisible ? "14.2857%" : "20%") : "100%";

  if (!renderLine) {
    return;
  }

  return (
    <div
      className=""
      style={{ top: height, position: "relative", zIndex: 20 }}
      aria-hidden={true}
    >
      <div className={timeIndicatorDashed} style={{ width: solidOffset }}></div>
      <div
        className={timeIndicatorSolid}
        style={{
          left: solidOffset,
          width: solidWidth,
        }}
      ></div>
      <div className={timeIndicatorFeature} style={{ left: solidOffset }}></div>
    </div>
  );
};

export default TimeIndicator;
