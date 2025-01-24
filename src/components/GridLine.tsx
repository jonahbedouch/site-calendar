import { cellGrid } from "./Grid.css";

const CalendarGridLine = () => {
  return (
    <div
      className={cellGrid}
      style={{
        height: "60px",
        width: "100%",
      }}
    ></div>
  );
};

export default CalendarGridLine;
