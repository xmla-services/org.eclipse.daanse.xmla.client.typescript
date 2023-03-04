import type { WarningColumn } from "./WarningColumn";
import type { WarningMeasure } from "./WarningMeasure";

/**
 * SourceObject
 * @targetNSAlias `eng200`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2010/engine/200`
 */
export interface SourceObject {
  /** WarningColumn */
  WarningColumn?: WarningColumn;
  /** WarningMeasure */
  WarningMeasure?: WarningMeasure;
}
