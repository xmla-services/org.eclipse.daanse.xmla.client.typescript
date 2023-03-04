import type { Events } from "./Events";
import type { XEvent } from "./XEvent";

/**
 * EventType
 * @targetNSAlias `eng300_300`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2011/engine/300/300`
 */
export interface EventType {
  /** Events */
  Events?: Events;
  /** XEvent */
  XEvent?: XEvent;
}
