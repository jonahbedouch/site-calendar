import { DateTime } from "luxon";
import { CalendarMode } from "./types";
import { useContext } from "preact/hooks";
import { State, StateManager } from "../calendar.island";
import { colHeaderBtn } from "./ColumnHeader.css";

interface Props {
  date: DateTime;
  numColumns: number;
}

const ColumnHeader = (props: Props) => {
  let state = useContext(State);

  let callback = () => {
    if (state.currentMode.value == CalendarMode.Week) {
      StateManager.setDate(state.currentDate, props.date);
      StateManager.setMode(state.currentMode, CalendarMode.Day);
    } else {
      StateManager.setMode(state.currentMode, CalendarMode.Week);
    }
  };

  return (
    <button
      class={colHeaderBtn}
      data-today={props.date.equals(
        DateTime.now().setZone(state.defaultTimezone.value).startOf("day"),
      )}
      style={{
        width: `${100 / props.numColumns}%`,
      }}
      onClick={callback}
      aria-label={
        state.currentMode.value == CalendarMode.Week
          ? `Switch to day view for ${props.date.toFormat("DDDD")}`
          : `Return to week view`
      }
    >
      {props.date.toFormat("d")}
      <span style={{ marginLeft: "2px", fontSize: "1rem" }}>
        {props.date.toFormat("ccc")}
      </span>
    </button>
  );
};

export default ColumnHeader;
