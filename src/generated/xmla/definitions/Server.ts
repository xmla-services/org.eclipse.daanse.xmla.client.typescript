import type { Annotations52 } from "./Annotations52";
import type { Databases } from "./Databases";
import type { Assemblies1 } from "./Assemblies1";
import type { Traces } from "./Traces";
import type { Roles1 } from "./Roles1";
import type { ServerProperties } from "./ServerProperties";

/**
 * Server
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface Server {
  /** xsd:string */
  Name?: string;
  /** xsd:string */
  ID?: string;
  /** xsd:dateTime */
  CreatedTimestamp?: string;
  /** xsd:dateTime */
  LastSchemaUpdate?: string;
  /** xsd:string */
  Description?: string;
  /** Annotations */
  Annotations?: Annotations52;
  /** xsd:string */
  ProductName?: string;
  /** xsd:string|Standard,Standard64,Enterprise,Enterprise64,Developer,Developer64,Evaluation,Evaluation64,Local,Local64,BusinessIntelligence,BusinessIntelligence64 */
  Edition?: string;
  /** xsd:long */
  EditionID?: string;
  /** xsd:string */
  Version?: string;
  /** xsd:string|Multidimensional,Tabular,SharePoint */
  ServerMode?: string;
  /** xsd:string */
  ProductLevel?: string;
  /** xsd:long */
  DefaultCompatibilityLevel?: string;
  /** xsd:string */
  SupportedCompatibilityLevels?: string;
  /** Databases */
  "Databases "?: Databases;
  /** Assemblies */
  Assemblies?: Assemblies1;
  /** Traces */
  Traces?: Traces;
  /** Roles */
  Roles?: Roles1;
  /** ServerProperties */
  ServerProperties?: ServerProperties;
}
