/**
 * VisualizationProperties
 * @targetNSAlias `eng300`
 * @targetNamespace `http://schemas.microsoft.com/analysisservices/2011/engine/300`
 */
export interface VisualizationProperties {
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
  /** xsd:boolean */
  IsDefaultMeasure?: string;
  /** xsd:integer */
  DefaultDetailsPosition?: string;
  /** xsd:integer */
  SortPropertiesPosition?: string;
  /** xsd:boolean */
  IsSimpleMeasure?: string;
}
