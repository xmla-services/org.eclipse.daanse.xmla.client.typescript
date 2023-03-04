import type { ParentObject } from "./ParentObject";
import type { Bindings } from "./Bindings";
import type { DataSource } from "./DataSource";
import type { DataSourceView } from "./DataSourceView";
import type { ErrorConfiguration } from "./ErrorConfiguration";

/**
 * Process
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Process {
  /** xsd:string|ProcessFull,ProcessAdd,ProcessUpdate,ProcessIndexes,ProcessScriptCache,ProcessData,ProcessDefault,ProcessClear,ProcessStructure,ProcessClearStructureOnly,ProcessClearIndexes,ProcessDefrag */
  Type?: string;
  /** Object */
  Object?: ParentObject;
  /** Bindings */
  Bindings?: Bindings;
  /** DataSource */
  DataSource?: DataSource;
  /** DataSourceView */
  DataSourceView?: DataSourceView;
  /** ErrorConfiguration */
  ErrorConfiguration?: ErrorConfiguration;
  /** WriteBackTableCreation|xsd:string|Create,CreateAlways,UseExisting */
  WriteBackTableCreation?: string;
}
