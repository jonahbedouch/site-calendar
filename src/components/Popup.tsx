import { Ref } from "preact";
import { Event } from "./types";
import {
  popupArrow,
  popupColorBar,
  popupInterior,
  popupLink,
} from "./Popup.css";
import LocationIcon from "./icons/Location";
import { srOnly } from "./Calendar.css";

interface Props {
  event: Event;
}

const EventPopup = (props: Props) => {
  const sameDay = props.event.start
    .startOf("day")
    .equals(props.event.end.startOf("day"));

  return (
    <>
      <div className={popupInterior}>
        <span
          style={{
            display: "flex",
            fontSize: "15px",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
          id={`${props.event.id}-dialog-title`}
        >
          {props.event.title}
        </span>
        <span
          style={{
            display: "flex",
            lineHeight: 1.6,
            marginTop: "4px",
            marginBottom: "4px",
          }}
        >
          {`${props.event.start
            .setZone("system")
            .toFormat(
              "LLLL d, yyyy t",
            )} - ${sameDay ? props.event.end.setZone("system").toFormat("t") : props.event.end.toFormat("LLLL d, yyyy t")}`}
        </span>
        {props.event.body != "" && (
          <span id={`${props.event.id}-dialog-body`}>{props.event.body}</span>
        )}
        {props.event.location != "" && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "14px",
            }}
          >
            <LocationIcon aria-hidden="true" style={{ marginRight: "5px" }} />{" "}
            <span className={srOnly}>Location: </span> {props.event.location}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          borderLeft: "1px solid var(--event-popover-border)",
          borderBottom: "1px solid var(--event-popover-border)",
          borderRight: "1px solid var(--event-popover-border)",
          borderRadius: "0 0 2px 2px",
        }}
      >
        {(props.event.links?.view ?? "") != "" && (
          <a tabIndex={0} href={props.event.links?.view} className={popupLink}>
            Open in Google Calendar
          </a>
        )}
        {(props.event.links?.clone ?? "") != "" && (
          <a tabIndex={0} href={props.event.links?.clone} className={popupLink}>
            Copy to your calendar
          </a>
        )}
      </div>

      <div className={popupColorBar}></div>
    </>
  );
};

export default EventPopup;
