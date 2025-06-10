import { Ref } from "preact";
import { Event } from "./types";
import {
  popupColorBar,
  popupFooter,
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

  const hasLeftLink =
    "links" in props.event &&
    "left" in props.event.links &&
    props.event.links.left != undefined &&
    "text" in props.event.links.left &&
    "url" in props.event.links.left;

  const hasRightLink =
    "links" in props.event &&
    "right" in props.event.links &&
    props.event.links.right != undefined &&
    "text" in props.event.links.right &&
    "url" in props.event.links.right;

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
      {(hasLeftLink || hasRightLink) && (
        <div className={popupFooter}>
          {hasLeftLink && (
            <a
              tabIndex={0}
              href={props.event.links.left!.url ?? "#"}
              className={popupLink}
            >
              {props.event.links.left!.text ?? ""}
            </a>
          )}
          {hasRightLink && (
            <a
              tabIndex={0}
              href={props.event.links.right!.url ?? "#"}
              className={popupLink}
            >
              {props.event.links.right!.text ?? ""}
            </a>
          )}
        </div>
      )}

      <div className={popupColorBar}></div>
    </>
  );
};

export default EventPopup;
