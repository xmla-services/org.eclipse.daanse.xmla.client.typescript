import type { AggregationDesign } from "./AggregationDesign";
import type { Assembly } from "./Assembly";
import type { Cube } from "./Cube";
import type { Database } from "./Database";
import type { DataSource } from "./DataSource";
import type { DataSourceView } from "./DataSourceView";
import type { Dimension6 } from "./Dimension6";
import type { MdxScript } from "./MdxScript";
import type { MeasureGroup1 } from "./MeasureGroup1";
import type { MiningModel } from "./MiningModel";
import type { MiningStructure } from "./MiningStructure";
import type { Partition } from "./Partition";
import type { Permission } from "./Permission";
import type { Perspective } from "./Perspective";
import type { Role } from "./Role";
import type { Server } from "./Server";
import type { Trace } from "./Trace";

/**
 * ObjectDefinition
 * @targetNSAlias `__tns__`
 * @targetNamespace `urn:schemas-microsoft-com:xml-analysis`
 */
export interface ObjectDefinition {
  /** AggregationDesign */
  AggregationDesign?: AggregationDesign;
  /** Assembly */
  Assembly?: Assembly;
  /** Cube */
  Cube?: Cube;
  /** Database */
  Database?: Database;
  /** DataSource */
  DataSource?: DataSource;
  /** DataSourceView */
  DataSourceView?: DataSourceView;
  /** Dimension */
  Dimension?: Dimension6;
  /** MdxScript */
  MdxScript?: MdxScript;
  /** MeasureGroup */
  MeasureGroup?: MeasureGroup1;
  /** MiningModel */
  MiningModel?: MiningModel;
  /** MiningStructure */
  MiningStructure?: MiningStructure;
  /** Partition */
  Partition?: Partition;
  /** Permission */
  Permission?: Permission;
  /** Perspective */
  Perspective?: Perspective;
  /** Role */
  Role?: Role;
  /** Server */
  Server?: Server;
  /** Trace */
  Trace?: Trace;
}
