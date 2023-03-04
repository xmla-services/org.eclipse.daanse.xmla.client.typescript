import type { Command } from "./Command";
import type { Properties1 } from "./Properties1";
import type { Parameters } from "./Parameters";

/** Execute */
export interface Execute {
  /** Command */
  Command?: Command;
  /** Properties */
  Properties?: Properties1;
  /** Parameters */
  Parameters?: Parameters;
}
