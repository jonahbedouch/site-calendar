import { useContext } from "preact/hooks";
import { State } from "../calendar.island";
import LeftIcon from "./icons/Right";
import RightIcon from "./icons/Left";
import { CalendarMode } from "./types";
import { DateTime } from "luxon";
import { bigSeparator, buttonBase } from "./Buttons.css";

interface Props {
  className?: string;
}

const DateButtons = (props: Props) => {
  let state = useContext(State);

  return (
    <div
      className={props.className ?? ""}
      role="group"
      aria-label="Calendar date controls"
    >
      <button
        className={buttonBase}
        onClick={() => {
          state.currentDate.value = state.currentDate.value.minus(
            state.currentMode.value == CalendarMode.Week
              ? { weeks: 1 }
              : { days: 1 },
          );
        }}
        aria-label={`Move the date back by 1 ${state.currentMode.value}`}
      >
        <LeftIcon style={{ strokeWidth: 3 }} aria-hidden={true} />
      </button>
      <button
        className={buttonBase}
        onClick={() => {
          state.currentDate.value = DateTime.now()
            .setZone(state.defaultTimezone.value)
            .startOf("day");
        }}
        aria-label={`Set the date to today`}
      >
        Today
      </button>
      <button
        className={buttonBase}
        onClick={() => {
          state.currentDate.value = state.currentDate.value.plus(
            state.currentMode.value == CalendarMode.Week
              ? { weeks: 1 }
              : { days: 1 },
          );
        }}
        aria-label={`Move the date forward by 1 ${state.currentMode.value}`}
      >
        <RightIcon style={{ strokeWidth: 3 }} aria-hidden={true} />
      </button>
    </div>
  );
};

export default DateButtons;
