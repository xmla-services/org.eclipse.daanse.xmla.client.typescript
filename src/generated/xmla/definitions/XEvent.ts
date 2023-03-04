import type { EventSession } from "./EventSession";

/**
 * XEvent
 * @targetNSAlias `ana`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface XEvent {
  /** event_session */
  event_session?: EventSession;
}
