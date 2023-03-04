/**
 * VisualizationProperties
 * @targetNSAlias `eng300`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2011/engine/300`
 */
export interface VisualizationProperties1 {
  /** xsd:integer */
  FolderPosition?: string;
  /** xsd:string|None,Context,Merge */
  ContextualNameRule?: string;
  /** xsd:string|Default,Left,Right,Center */
  Alignment?: string;
  /** xsd:boolean */
  IsFolderDefault?: string;
  /** xsd:boolean */
  IsRightToLeft?: string;
  /** xsd:string|Default,Ascending,Descending */
  SortDirection?: string;
  /** xsd:string */
  Units?: string;
  /** xsd:integer */
  Width?: string;
  /** xsd:integer */
  DefaultDetailsPosition?: string;
  /** xsd:integer */
  CommonIdentifierPosition?: string;
  /** xsd:integer */
  SortPropertiesPosition?: string;
  /** xsd:integer */
  DisplayKeyPosition?: string;
  /** xsd:boolean */
  IsDefaultImage?: string;
  /** xsd:string|Default,None,Sum,Min,Max,Count,Average */
  DefaultAggregateFunction?: string;
}
