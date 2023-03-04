import type { Event1 } from "./Event1";
import type { Target } from "./Target";

/** event_session */
export interface EventSession {
  /** xsd:string */
  templateCategory?: string;
  /** xsd:string */
  templateName?: string;
  /** xsd:string */
  templateDescription?: string;
  /** event[] */
  event?: Array<Event1>;
  /** target[] */
  target?: Array<Target>;
}
