import { DateTime, Zone } from "luxon";
import { ReadonlySignal, Signal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { State } from "../calendar.island";
import { flexRow, margin0 } from "./Calendar.css";
import { gutterBorder, localBorder, timeHeader, timeText } from "./Gutter.css";

// If it's a multi-day view, they should be based on the first day in the view.
interface Props {
  lowerBound: ReadonlySignal<DateTime>;
  upperBound: ReadonlySignal<DateTime>;
}

const CalendarGutter = (props: Props) => {
  const state = useContext(State);
  let timezone = state.defaultTimezone.value;
  let showLocal = state.showLocal.value;
  let startZone = props.lowerBound.value;
  let stopZone = props.upperBound.value;
  let startLocal = props.lowerBound.value.setZone("system");
  let stopLocal = props.upperBound.value.setZone("system");
  let zoneTimes: string[] = [];
  let localTimes: string[] = [];

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

  return (
    <div className={`${flexRow} ${gutterBorder}`} aria-hidden="true">
      <div style={{ width: "75px" }}>
        <div style={{ height: "60px" }}>
          {showLocal ? (
            <h2 className={`${timeHeader} ${margin0}`}>
              {state.defaultTimezoneName}
            </h2>
          ) : (
            <></>
          )}
        </div>
        {zoneTimes.map((time) => (
          <div style={{ height: "60px", position: "relative" }}>
            <p className={`${margin0} ${timeText}`}>{time}</p>
          </div>
        ))}
      </div>
      {showLocal ? (
        <div className={localBorder} style={{ width: "75px" }}>
          <div style={{ height: "60px" }}>
            <h2 className={`${timeHeader} ${margin0}`}>Your Time</h2>
          </div>
          {localTimes.map((time) => (
            <div style={{ height: "60px", position: "relative" }}>
              <p className={`${margin0} ${timeText}`}>{time}</p>
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
