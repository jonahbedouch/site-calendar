import CalendarGridLine from "./GridLine";

interface Props {
  cellCnt: number;
}

const HorizontalGrid = (props: Props) => {
  let cells = [];
  for (let i = 0; i < props.cellCnt; i++) {
    cells.push(<CalendarGridLine key={`someid-${i}`} />);
  }

  return (
    <div aria-hidden="true" style={{ position: "relative", zIndex: 10 }}>
      {cells}
    </div>
  );
};

export default HorizontalGrid;
