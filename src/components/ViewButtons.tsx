import { useContext } from "preact/hooks";
import { State } from "../calendar.island";
import LeftIcon from "./icons/Right";
import RightIcon from "./icons/Left";
import { CalendarMode } from "./types";
import { buttonBase } from "./Buttons.css";

interface Props {
  className?: string;
}

const ViewButtons = (props: Props) => {
  let state = useContext(State);

  return (
    <div
      role="group"
      aria-label="Calendar view controls"
      className={props.className ?? ""}
    >
      <button
        className={buttonBase}
        onClick={() => {
          state.currentMode.value = CalendarMode.Day;
        }}
      >
        Day
      </button>
      <button
        className={buttonBase}
        onClick={() => {
          state.currentMode.value = CalendarMode.Week;
        }}
      >
        Week
      </button>
    </div>
  );
};

export default ViewButtons;
