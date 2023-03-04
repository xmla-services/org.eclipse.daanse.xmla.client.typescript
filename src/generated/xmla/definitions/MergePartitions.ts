import type { Sources } from "./Sources";
import type { ParentObject } from "./ParentObject";

/**
 * MergePartitions
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface MergePartitions {
  /** Sources */
  Sources?: Sources;
  /** Target */
  Target?: ParentObject;
}
