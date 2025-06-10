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
import EventPopup from "./Popup";
import { popupExterior } from "./Popup.css";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

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

  const arrowRef = useRef<HTMLDivElement>(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement: "right",
    middleware: [
      offset(8),
      shift(),
      flip({ fallbackPlacements: ["left", "top"] }),
      arrow({
        element: arrowRef,
        padding: { top: 10, bottom: 2, left: 2, right: 2 },
      }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  // Handle the focusout event to close the tooltip if focus moves out of the tooltip
  const handleFocusOut = (e: FocusEvent) => {
    // Check if the focus has moved out of the tooltip
    if (
      refs.floating.current &&
      !refs.floating.current.contains(e.relatedTarget as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Attach the focusout event listener to the tooltip
  useEffect(() => {
    if (refs.floating.current) {
      refs.floating.current.addEventListener("focusout", handleFocusOut, true);
    }

    return () => {
      if (refs.floating.current) {
        refs.floating.current.removeEventListener(
          "focusout",
          handleFocusOut,
          true,
        );
      }
    };
  }, [isOpen]);

  const handleBlur = (event: FocusEvent) => {
    if (
      event.relatedTarget != null &&
      refs.floating.current?.contains(event.relatedTarget as Element) == false
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (refs.reference.current != null) {
      setFontSize(
        parseFloat(window.getComputedStyle(refs.reference.current).fontSize),
      );
    }
  }, [refs.reference.current]);

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
        ref={refs.setReference}
        onBlur={handleBlur}
        aria-describedby={`${props.event.id}-dialog`}
        role="button"
        aria-focusable=""
        tabIndex={0}
        {...getReferenceProps()}
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
      {isOpen && (
        <div
          className={popupExterior}
          ref={refs.setFloating}
          style={{
            position: "relative",
            ...(state.colorScheme.value == "light"
              ? (props.event.category?.lightTheme ?? "")
              : (props.event.category?.darkTheme ?? "")),
            ...(floatingStyles ?? ""),
          }}
          role="dialog"
          id={`${props.event.id}-dialog`}
          aria-labelledby={`${props.event.id}-dialog-title`}
          aria-describedby={
            props.event.body != "" ? `${props.event.id}-dialog-body` : undefined
          }
          {...getFloatingProps()}
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            fill={"var(--event-popover-bg)"}
            stroke={"var(--event-popover-border)"}
            strokeWidth={1}
            tipRadius={0.5}
            style={{ transform: "translateY(-1px)" }}
          />
          <EventPopup event={props.event} />
        </div>
      )}
    </>
  );
};

export default CalendarEvent;
