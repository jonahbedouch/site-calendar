import { useContext } from "preact/hooks";
import { State } from "../calendar.island";
import { srOnly } from "./Calendar.css";
import { monthText } from "./Buttons.css";

interface Props {
  className?: string;
}

const MonthView = (props: Props) => {
  const state = useContext(State);
  return (
    <span className={`${monthText} ${props.className ?? ""}`}>
      <span className={srOnly}>Current Month: </span>
      {state.currentDate.value.toFormat("MMMM yyyy")}
    </span>
  );
};

export default MonthView;
