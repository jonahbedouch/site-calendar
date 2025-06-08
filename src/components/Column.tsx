import { DateTime } from "luxon";
import CalendarEvent from "./CalenderEvent";
import { State } from "../calendar.island";
import { useContext } from "preact/hooks";
import { calColumn, eventList } from "./Column.css";
import { flexCol, srOnly } from "./Calendar.css";
import { Event } from "./types";
import { computed } from "@preact/signals";
import { ChannelAllocator } from "../utils/ChannelAllocator";

interface Props {
  numCols: number;
  numRows: number;
  date: DateTime;
}

const InteractiveColumn = (props: Props) => {
  let state = useContext(State);

  let events = state.visibleEvents.value
    .filter((v) => {
      return (
        v.start.startOf("day").equals(props.date) &&
        v.end.startOf("day").equals(props.date)
      );
    })
    .sort((a, b) => {
      return a.start > b.start
        ? 1
        : a.start < b.start
          ? -1
          : a.end < b.end
            ? 1
            : 0;
    });

  let channelAllocator = new ChannelAllocator();
  for (const event of events) {
    channelAllocator.allocate(event);
  }

  if (events.length != 0) {
    return (
      <li
        className={`${flexCol} ${calColumn}`}
        data-today={DateTime.now().hasSame(props.date, "day") || undefined}
        style={{ width: `${100 / props.numCols}%` }}
      >
        <h2 className={srOnly}>{props.date.toFormat("DD")}</h2>
        <ul className={eventList}>
          {events.map((event) => (
            <CalendarEvent
              event={event}
              index={channelAllocator.getIndex(event)}
              overlap={channelAllocator.getOverlap(event)}
            />
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li
      className={`${flexCol} ${calColumn}`}
      data-today={DateTime.now().hasSame(props.date, "day") || undefined}
      style={{ width: `${100 / props.numCols}%` }}
    >
      <h2 className={srOnly}>{`No events on ${props.date.toFormat("DD")}`}</h2>
    </li>
  );
};

export default InteractiveColumn;
