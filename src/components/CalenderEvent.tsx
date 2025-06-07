import { ColorScheme, Event } from "./types";
import LocationIcon from "./icons/Location";
import { State } from "../calendar.island";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { computed } from "@preact/signals";
import {
  calendarDate,
  calendarEventContainer,
  calendarEventInternal,
  calendarEventTitle,
  locationHolder,
} from "./CalendarEvent.css";
import {
  createPopper,
  Instance,
  State as PState,
} from "@popperjs/core/lib/popper-lite";
import EventPopup from "./Popup";
import { popupArrow, popupExterior } from "./Popup.css";
import { usePopper } from "react-popper";

const MINUTE_PX = 1;

interface Props {
  event: Event;
  index: number;
  overlap: number;
}

const CalendarEvent = (props: Props) => {
  const state = useContext(State);
  const topOffset = computed(() => {
    return (
      (props.event.start.get("hour") * 60 +
        props.event.start.get("minute") -
        state.startTime.value * 60) *
      MINUTE_PX
    );
  });

  const height = computed(() => {
    return (
      (props.event.end.get("hour") * 60 +
        props.event.end.get("minute") -
        state.startTime.value * 60) *
        MINUTE_PX -
      topOffset.value
    );
  });

  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(15.2);
  const button = useRef<HTMLLIElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  let popperInstance = usePopper(button.current, tooltip.current, {
    placement: "auto",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "arrow",
        options: {
          element: arrow.current,
        },
        enabled: true,
      },
      {
        name: "flip",
        options: {
          allowedAutoPlacements: ["left", "right"],
        },
        enabled: true,
      },
    ],
  });

  const handleButtonClick = () => {
    setIsOpen(true);

    if (popperInstance && popperInstance.update != null) {
      popperInstance.update();
    }
  };

  const handleButtonKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsOpen(true);

      if (popperInstance && popperInstance.update != null) {
        popperInstance.update();
      }
    }
  };

  // Handle the focusout event to close the tooltip if focus moves out of the tooltip
  const handleFocusOut = (e: FocusEvent) => {
    // Check if the focus has moved out of the tooltip
    if (tooltip.current && !tooltip.current.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key == "Escape") {
      setIsOpen(false);
    }
  };

  // Attach the focusout event listener to the tooltip
  useEffect(() => {
    if (tooltip.current) {
      tooltip.current.addEventListener("focusout", handleFocusOut, true);
      document.addEventListener("keydown", handleEscape, true);
    }

    return () => {
      if (tooltip.current) {
        tooltip.current.removeEventListener("focusout", handleFocusOut, true);
        document.removeEventListener("keydown", handleEscape, true);
      }
    };
  }, [isOpen]);

  // Close tooltip if user clicks outside of the button or tooltip
  const handleClickOutside = (event: MouseEvent) => {
    if (
      button.current &&
      event.target &&
      !button.current.contains(event.target as Node) &&
      tooltip.current &&
      !tooltip.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleBlur = (event: FocusEvent) => {
    if (
      event.relatedTarget != null &&
      tooltip.current?.contains(event.relatedTarget as Element) == false
    ) {
      setIsOpen(false);
    }
  };

  // Attach click event listener to the document to detect clicks outside
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (button.current != null) {
      setFontSize(parseFloat(window.getComputedStyle(button.current).fontSize));
    }
  }, [button]);

  const localStart = props.event.start.setZone("system");
  const localEnd = props.event.end.setZone("system");

  return (
    <>
      <li
        className={calendarEventContainer}
        style={{
          top: Math.max(topOffset.value, 0),
          height: Math.max(height.value - 2, 0),
          width: `${100 / props.overlap - 2.5}%`,
          left: `${props.index * (100 / props.overlap)}%`,
          ...(state.colorScheme.value == "light"
            ? (props.event.category?.lightTheme ?? "")
            : (props.event.category?.darkTheme ?? "")),
        }}
        ref={button}
        onClick={handleButtonClick}
        onBlur={handleBlur}
        onKeyDown={handleButtonKeyPress}
        aria-describedby={`${props.event.id}-dialog`}
        role="button"
        aria-focusable=""
        tabIndex={0}
      >
        <div
          className={calendarEventInternal}
          style={{
            flexDirection: height.value > fontSize * 2 ? "column" : "row",
          }}
        >
          <span
            className={calendarDate}
            aria-label={`${localStart.toFormat(
              "cccc LLLL d, t",
            )} to ${localEnd.toFormat("cccc LLLL d, t")}`}
            style={{
              minWidth: height.value > fontSize * 2 ? "unset" : "max-content",
              marginRight: "0.25em",
            }}
          >
            {`${localStart.toFormat(
              localStart.minute == 0 ? "ha" : "h:mma",
            )} - ${localEnd.toFormat(localEnd.minute == 0 ? "ha" : "h:mma")}`}
          </span>
          <span
            className={calendarEventTitle}
            style={{
              webkitLineClamp: Math.max(
                Math.floor((height.value - fontSize * 2 - 4) / 15),
                1,
              ),
              width: height.value > fontSize * 2 ? "auto" : "100%",
              height: height.value > fontSize * 2 ? "auto" : fontSize,
            }}
          >
            {props.event.title}
          </span>
          {props.event.location != "" ? (
            <div
              className={locationHolder}
              style={{ display: height.value > 50 ? "inline" : "none" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <LocationIcon aria-hidden="true" />
                <span aria-label={`Location: ${props.event.location}`}>
                  {props.event.location}
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </li>

      <div
        className={popupExterior}
        ref={tooltip}
        style={{
          visibility: isOpen ? "visible" : "hidden", // Make it visible when opened
          position: "relative",
          ...(state.colorScheme.value == "light"
            ? (props.event.category?.lightTheme ?? "")
            : (props.event.category?.darkTheme ?? "")),
          ...(popperInstance?.styles.popper ?? ""),
        }}
        role="dialog"
        id={`${props.event.id}-dialog`}
        aria-labelledby={`${props.event.id}-dialog-title`}
        aria-describedby={
          props.event.body != "" ? `${props.event.id}-dialog-body` : undefined
        }
        {...popperInstance?.attributes.popper}
      >
        <div
          ref={arrow}
          className={popupArrow}
          style={{
            ...(popperInstance?.styles.arrow ?? ""),
            display: isOpen ? "block" : "none",
          }}
          {...popperInstance?.attributes.arrow}
          aria-hidden="true"
        ></div>
        <EventPopup event={props.event} />
      </div>
    </>
  );
};

export default CalendarEvent;
